/* Caderno do Eu — correção V5: avaliação de 20 afirmações */
(function () {
  if (window.__cadernoAssessmentV5) return;
  window.__cadernoAssessmentV5 = true;

  const SUPABASE_URL = "https://tqnzepzfxqwqwtqpprem.supabase.co";
  const SUPABASE_KEY = "sb_publishable_1rucc2qibLHPVTrC3ajIRA_eJa-UZ53";
  const fixDb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const groups = [
    { dimension: "Emoções", items: [
      "Consigo reconhecer e nomear o que estou sentindo.",
      "Consigo acolher minhas emoções sem me julgar imediatamente.",
      "Consigo compreender o que pode estar despertando minhas emoções.",
      "Permito-me sentir sem julgar ou reprimir imediatamente o que sinto."
    ]},
    { dimension: "Autoestima", items: [
      "Reconheço qualidades e capacidades em mim.",
      "Trato a mim mesma com respeito e gentileza.",
      "Sinto que tenho valor, independentemente da aprovação das outras pessoas.",
      "Sinto-me merecedora de amor, respeito e coisas boas."
    ]},
    { dimension: "Limites e escolhas", items: [
      "Consigo perceber e expressar minhas necessidades.",
      "Sinto que posso fazer escolhas respeitando meus limites.",
      "Tenho facilidade para dizer não quando algo ultrapassa meus limites.",
      "Consigo expressar minhas opiniões e vontades com clareza."
    ]},
    { dimension: "Autocuidado e corpo", items: [
      "Percebo os sinais do meu corpo e procuro respeitá-los.",
      "Consigo incluir atitudes de cuidado na minha rotina.",
      "Consigo reservar momentos para cuidar de mim sem sentir culpa.",
      "Respeito meu corpo e procuro acolher suas necessidades."
    ]},
    { dimension: "Propósito e perspectivas", items: [
      "Tenho clareza sobre valores que são importantes para mim.",
      "Consigo perceber desejos ou possibilidades que me motivam.",
      "Consigo reconhecer desejos e sonhos que são importantes para mim.",
      "Tenho esperança na possibilidade de construir uma vida mais alinhada comigo mesma."
    ]}
  ];

  const options = [
    { value: 1, label: "Concordo", score: 3 },
    { value: 2, label: "Discordo", score: 1 },
    { value: 3, label: "Mais ou menos", score: 2 },
    { value: 4, label: "Não tenho certeza", score: null }
  ];

  function el(id) { return document.getElementById(id); }

  window.assessmentMarkup = function () {
    return groups.map((group, gi) =>
      `<section class="assessment-group"><h3>${group.dimension}</h3>` +
      group.items.map((question, qi) => {
        const n = gi * 4 + qi;
        return `<fieldset class="assessment-question"><legend>${question}</legend>` +
          `<div class="scale-options scale-four">` +
          options.map(option =>
            `<label class="scale-option"><input type="radio" name="a${n}" value="${option.value}">` +
            `<span>${option.label}</span></label>`
          ).join("") +
          `</div></fieldset>`;
      }).join("") + `</section>`
    ).join("");
  };

  window.showAssessment = async function (stage) {
    const gate = el("assessmentGate");
    const shell = el("journeyShell");
    if (!gate || !shell) return;

    gate.classList.remove("hidden");
    shell.classList.add("hidden");
    gate.style.display = "block";
    shell.style.display = "none";
    document.body.classList.add("assessment-open");

    el("assessmentTitle").textContent = stage === "baseline"
      ? "Antes de começar, vamos olhar para você?"
      : "Você chegou ao fim dos 30 dias. Como se percebe agora?";
    el("assessmentIntro").textContent =
      "Leia cada afirmação e escolha a resposta que mais combina com o que você sente hoje. Não existe resposta certa ou errada.";

    el("assessmentQuestions").innerHTML = window.assessmentMarkup();
    el("assessmentMsg").textContent = "";
    const saveButton = el("saveAssessment");
    saveButton.disabled = true;
    el("assessmentMsg").textContent = "Carregando sua avaliação...";

    const { data: sessionData, error: sessionError } = await fixDb.auth.getSession();
    const currentUser = sessionData && sessionData.session && sessionData.session.user;
    if (sessionError || !currentUser) {
      el("assessmentMsg").textContent = "Sua sessão expirou. Atualize a página e entre novamente.";
      return;
    }

    const { data: previous } = await fixDb.from("caderno_assessments")
      .select("answers").eq("user_id", currentUser.id).eq("stage", stage).maybeSingle();

    if (previous && previous.answers) {
      Object.entries(previous.answers).forEach(([name, value]) => {
        const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (input) input.checked = true;
      });
    }

    el("assessmentMsg").textContent = "";
    saveButton.disabled = false;
    saveButton.onclick = async function () {
      const answers = {};
      for (let i = 0; i < 20; i++) {
        const selected = document.querySelector(`input[name="a${i}"]:checked`);
        if (!selected) {
          el("assessmentMsg").textContent = `Falta responder à afirmação ${i + 1}.`;
          document.querySelector(`input[name="a${i}"]`)
            ?.closest(".assessment-question")
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        answers[`a${i}`] = Number(selected.value);
      }

      const dimensionScores = {};
      groups.forEach((group, gi) => {
        const validScores = group.items.map((_, qi) => {
          const value = answers[`a${gi * 4 + qi}`];
          return options.find(option => option.value === value).score;
        }).filter(score => score !== null);
        dimensionScores[group.dimension] = validScores.length
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : null;
      });

      saveButton.disabled = true;
      el("assessmentMsg").textContent = "Salvando sua avaliação...";
      const { error } = await fixDb.from("caderno_assessments").upsert({
        user_id: currentUser.id,
        stage,
        answers,
        dimension_scores: dimensionScores,
        completed_at: new Date().toISOString()
      }, { onConflict: "user_id,stage" });

      saveButton.disabled = false;
      if (error) {
        el("assessmentMsg").textContent = "Não foi possível salvar. Tente novamente ou avise a terapeuta.";
        return;
      }

      gate.classList.add("hidden");
      gate.style.display = "";
      shell.classList.remove("hidden");
      shell.style.display = "";
      document.body.classList.remove("assessment-open");
      el("assessmentMsg").textContent = "Avaliação salva.";
    };
  };

  const style = document.createElement("style");
  style.textContent = `
    #assessmentGate { position:relative; z-index:2; width:100%; max-height:none; overflow:visible; }
    #assessmentQuestions { max-height:none; overflow:visible; }
    body.assessment-open #journeyShell { display:none !important; }
    .scale-options.scale-four { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
    .scale-four .scale-option { min-height:62px; margin:0; padding:10px 6px; display:flex; align-items:center; justify-content:center; gap:7px; border:1px solid #e0dfd4; border-radius:11px; background:#f8f5ed; text-align:center; }
    .scale-four .scale-option input { width:auto; margin:0; flex:0 0 auto; }
    .scale-four .scale-option span { display:inline; font:13px/1.3 Arial,sans-serif; color:#526b59; }
    @media(max-width:650px) {
      .scale-options.scale-four { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .scale-four .scale-option { min-height:54px; }
      #assessmentGate { padding:20px 16px; }
      #assessmentGate h2 { font-size:25px; line-height:1.25; }
    }
  `;
  document.head.appendChild(style);
})();
