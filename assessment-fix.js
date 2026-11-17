
/* Atualização da avaliação: 20 afirmações, escala simples e tela sem sobreposição. */
(function () {
  const extra = [
    ["Emoções", [
      "Consigo compreender o que pode estar despertando minhas emoções.",
      "Permito-me sentir sem julgar ou reprimir imediatamente o que sinto."
    ]],
    ["Autoestima", [
      "Sinto que tenho valor, independentemente da aprovação das outras pessoas.",
      "Sinto-me merecedora de amor, respeito e coisas boas."
    ]],
    ["Limites e escolhas", [
      "Tenho facilidade para dizer não quando algo ultrapassa meus limites.",
      "Consigo expressar minhas opiniões e vontades com clareza."
    ]],
    ["Autocuidado e corpo", [
      "Consigo reservar momentos para cuidar de mim sem sentir culpa.",
      "Respeito meu corpo e procuro acolher suas necessidades."
    ]],
    ["Propósito e perspectivas", [
      "Consigo reconhecer desejos e sonhos que são importantes para mim.",
      "Tenho esperança e confiança na possibilidade de construir uma vida mais alinhada comigo mesma."
    ]]
  ];
  extra.forEach((g, i) => assessmentItems[i].items.push(...g[1]));

  const responseOptions = [
    { value: "1", label: "Concordo", score: 3 },
    { value: "2", label: "Discordo", score: 1 },
    { value: "3", label: "Mais ou menos", score: 2 },
    { value: "4", label: "Não tenho certeza", score: null }
  ];

  window.assessmentMarkup = function () {
    return assessmentItems.map((group, gi) =>
      `<section class="assessment-group"><h3>${group.dimension}</h3>` +
      group.items.map((question, qi) => {
        const id = `a${gi * 4 + qi}`;
        return `<fieldset class="assessment-question"><legend>${question}</legend><div class="scale-options scale-four">` +
          responseOptions.map(o => `<label class="scale-option"><input type="radio" name="${id}" value="${o.value}"><span>${o.label}</span></label>`).join("") +
          `</div></fieldset>`;
      }).join("") + `</section>`
    ).join("");
  };

  window.showAssessment = function (stage) {
    const gate = document.getElementById("assessmentGate");
    const shell = document.getElementById("journeyShell");
    gate.classList.remove("hidden");
    shell.classList.add("hidden");
    document.getElementById("assessmentTitle").textContent =
      stage === "baseline" ? "Antes de começar, vamos olhar para você?" : "Você chegou ao fim dos 30 dias. Como se percebe agora?";
    document.getElementById("assessmentIntro").textContent =
      "Leia cada frase e escolha a resposta que mais combina com o que você sente hoje. Não pense demais: não existe resposta certa ou errada.";
    document.getElementById("assessmentQuestions").innerHTML = window.assessmentMarkup();
    const previous = assessments[stage]?.answers || {};
    Object.entries(previous).forEach(([key, value]) => {
      const el = document.querySelector(`input[name="${key}"][value="${value}"]`);
      if (el) el.checked = true;
    });
    document.getElementById("assessmentMsg").textContent = "";
    document.getElementById("saveAssessment").onclick = async () => {
      const answers = {};
      for (let i = 0; i < 20; i++) {
        const selected = document.querySelector(`input[name="a${i}"]:checked`);
        if (!selected) {
          document.getElementById("assessmentMsg").textContent = "Responda às 20 afirmações para continuar. Se estiver em dúvida, escolha “Não tenho certeza”.";
          return;
        }
        answers[`a${i}`] = Number(selected.value);
      }
      const scores = {};
      assessmentItems.forEach((group, gi) => {
        const valid = group.items.map((_, qi) => {
          const option = responseOptions.find(o => o.value === String(answers[`a${gi * 4 + qi}`]));
          return option?.score;
        }).filter(v => v !== null && v !== undefined);
        scores[group.dimension] = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
      });
      const btn = document.getElementById("saveAssessment");
      btn.disabled = true;
      document.getElementById("assessmentMsg").textContent = "Salvando sua avaliação...";
      const { error } = await db.from("caderno_assessments").upsert({
        user_id: user.id, stage, answers, dimension_scores: scores, completed_at: new Date().toISOString()
      }, { onConflict: "user_id,stage" });
      btn.disabled = false;
      if (error) {
        document.getElementById("assessmentMsg").textContent = "Não foi possível salvar. Tente novamente ou avise a terapeuta.";
        return;
      }
      assessments[stage] = { answers, dimension_scores: scores };
      gate.classList.add("hidden");
      shell.classList.remove("hidden");
      renderAssessmentChart();
    };
  };

  window.renderAssessmentChart = function () {
    const canvas = document.getElementById("assessmentChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const names = assessmentItems.map(x => x.dimension);
    const left = 190, right = 28, top = 24, bottom = 24, plotW = w-left-right, rowH = (h-top-bottom)/5;
    ctx.font = "13px Arial"; ctx.fillStyle = "#687565"; ctx.strokeStyle = "#e5e6dc";
    for (let v=1; v<=3; v++) {
      const x = left + (v-1)*plotW/2;
      ctx.beginPath(); ctx.moveTo(x,top); ctx.lineTo(x,h-bottom); ctx.stroke();
      ctx.fillText(["Discordo","Mais ou menos","Concordo"][v-1], x-32, h-6);
    }
    names.forEach((name,i) => {
      const y = top+i*rowH+rowH/2;
      ctx.fillStyle="#596657"; ctx.fillText(name,left-175,y+4);
      const a=assessments.baseline?.dimension_scores?.[name], b=assessments.final?.dimension_scores?.[name];
      if (a!=null) {ctx.fillStyle="#b48b55";ctx.fillRect(left,y-13,Math.max(0,(a-1)*plotW/2),9);}
      if (b!=null) {ctx.fillStyle="#729779";ctx.fillRect(left,y+1,Math.max(0,(b-1)*plotW/2),9);}
    });
    const note=document.getElementById("assessmentChartNote");
    if(note) note.textContent=assessments.final
      ? "Comparação das suas respostas no início e ao final da jornada. “Não tenho certeza” não entra no cálculo das médias."
      : "Este é seu ponto de partida. A comparação final será mostrada quando você concluir os 30 dias e responder novamente.";
  };

  const originalRefresh = window.refresh;
  window.refresh = async function () {
    await originalRefresh();
    /* Caderno do Eu — correção integrada da avaliação */
(function () {
  if (window.__cadernoAssessmentV2) return;
  window.__cadernoAssessmentV2 = true;

  const extra = [
    ["Emoções", [
      "Consigo compreender o que pode estar despertando minhas emoções.",
      "Permito-me sentir sem julgar ou reprimir imediatamente o que sinto."
    ]],
    ["Autoestima", [
      "Sinto que tenho valor, independentemente da aprovação das outras pessoas.",
      "Sinto-me merecedora de amor, respeito e coisas boas."
    ]],
    ["Limites e escolhas", [
      "Tenho facilidade para dizer não quando algo ultrapassa meus limites.",
      "Consigo expressar minhas opiniões e vontades com clareza."
    ]],
    ["Autocuidado e corpo", [
      "Consigo reservar momentos para cuidar de mim sem sentir culpa.",
      "Respeito meu corpo e procuro acolher suas necessidades."
    ]],
    ["Propósito e perspectivas", [
      "Consigo reconhecer desejos e sonhos que são importantes para mim.",
      "Tenho esperança na possibilidade de construir uma vida mais alinhada comigo mesma."
    ]]
  ];

  // Acrescenta as 10 afirmações complementares às 10 já existentes.
  extra.forEach((group, index) => {
    if (assessmentItems[index].items.length === 2) {
      assessmentItems[index].items.push(...group[1]);
    }
  });

  const options = [
    { value: 1, label: "Concordo", score: 3 },
    { value: 2, label: "Discordo", score: 1 },
    { value: 3, label: "Mais ou menos", score: 2 },
    { value: 4, label: "Indecisa", score: null }
  ];

  window.assessmentMarkup = function () {
    return assessmentItems.map((group, gi) =>
      `<section class="assessment-group">
        <h3>${group.dimension}</h3>
        ${group.items.map((question, qi) => {
          const id = `a${gi * 4 + qi}`;
          return `<fieldset class="assessment-question">
            <legend>${question}</legend>
            <div class="scale-options scale-four">
              ${options.map(option => `
                <label class="scale-option">
                  <input type="radio" name="${id}" value="${option.value}">
                  <span>${option.label}</span>
                </label>`).join("")}
            </div>
          </fieldset>`;
        }).join("")}
      </section>`
    ).join("");
  };

  window.showAssessment = function (stage) {
    const gate = document.getElementById("assessmentGate");
    const shell = document.getElementById("journeyShell");
    gate.classList.remove("hidden");
    shell.classList.add("hidden");
    document.body.classList.add("assessment-open");

    document.getElementById("assessmentTitle").textContent =
      stage === "baseline"
        ? "Antes de começar, vamos olhar para você?"
        : "Você chegou ao fim dos 30 dias. Como se percebe agora?";
    document.getElementById("assessmentIntro").textContent =
      "Leia cada frase e escolha a resposta que mais combina com o que você sente hoje. Não existe resposta certa ou errada. Se estiver em dúvida, pode marcar “Indecisa”.";

    document.getElementById("assessmentQuestions").innerHTML = window.assessmentMarkup();

    const previous = assessments[stage]?.answers || {};
    Object.entries(previous).forEach(([key, value]) => {
      const input = document.querySelector(`input[name="${key}"][value="${value}"]`);
      if (input) input.checked = true;
    });

    const message = document.getElementById("assessmentMsg");
    const button = document.getElementById("saveAssessment");
    message.textContent = "";
    button.disabled = false;
    button.onclick = async () => {
      const answers = {};
      for (let i = 0; i < 20; i++) {
        const selected = document.querySelector(`input[name="a${i}"]:checked`);
        if (!selected) {
          message.textContent = `Faltam respostas. Confira a afirmação ${i + 1} e escolha uma das quatro opções.`;
          document.querySelector(`input[name="a${i}"]`)?.closest(".assessment-question")?.scrollIntoView({behavior:"smooth", block:"center"});
          return;
        }
        answers[`a${i}`] = Number(selected.value);
      }

      const scores = {};
      assessmentItems.forEach((group, gi) => {
        const validScores = group.items.map((_, qi) => {
          const selected = options.find(option => option.value === answers[`a${gi * 4 + qi}`]);
          return selected ? selected.score : null;
        }).filter(score => score !== null);
        scores[group.dimension] = validScores.length
          ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
          : null;
      });

      button.disabled = true;
      message.textContent = "Salvando sua avaliação...";
      const { error } = await db.from("caderno_assessments").upsert({
        user_id: user.id,
        stage,
        answers,
        dimension_scores: scores,
        completed_at: new Date().toISOString()
      }, { onConflict: "user_id,stage" });

      button.disabled = false;
      if (error) {
        message.textContent = "Não foi possível salvar. Tente novamente ou avise a terapeuta.";
        return;
      }

      assessments[stage] = { answers, dimension_scores: scores };
      gate.classList.add("hidden");
      document.body.classList.remove("assessment-open");
      shell.classList.remove("hidden");
      window.renderAssessmentChart();
    };
  };

  window.renderAssessmentChart = function () {
    const canvas = document.getElementById("assessmentChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width, height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    const names = assessmentItems.map(item => item.dimension);
    const left = 190, right = 28, top = 24, bottom = 28;
    const plotWidth = width - left - right;
    const rowHeight = (height - top - bottom) / names.length;

    ctx.font = "13px Arial";
    ctx.fillStyle = "#687565";
    ctx.strokeStyle = "#e5e6dc";
    [1, 2, 3].forEach((value, index) => {
      const x = left + index * plotWidth / 2;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, height - bottom); ctx.stroke();
      ctx.fillText(["Discordo", "Mais ou menos", "Concordo"][index], x - 32, height - 7);
    });

    names.forEach((name, index) => {
      const y = top + index * rowHeight + rowHeight / 2;
      ctx.fillStyle = "#596657";
      ctx.fillText(name, left - 175, y + 4);
      const start = assessments.baseline?.dimension_scores?.[name];
      const finish = assessments.final?.dimension_scores?.[name];
      if (start != null) {
        ctx.fillStyle = "#b48b55";
        ctx.fillRect(left, y - 13, Math.max(0, (start - 1) * plotWidth / 2), 9);
      }
      if (finish != null) {
        ctx.fillStyle = "#729779";
        ctx.fillRect(left, y + 1, Math.max(0, (finish - 1) * plotWidth / 2), 9);
      }
    });

    const note = document.getElementById("assessmentChartNote");
    if (note) note.textContent = assessments.final
      ? "Comparação das suas respostas no início e ao final da jornada. A opção “Indecisa” não entra no cálculo das médias."
      : "Este é seu ponto de partida. A comparação final aparecerá quando você concluir os 30 dias e responder novamente.";
  };

  // Reforça a tela exclusiva da avaliação após o carregamento dos dados.
  const originalRefresh = window.refresh;
  window.refresh = async function () {
    await originalRefresh();
    if (assessments.baseline && Object.keys(assessments.baseline.answers || {}).length < 20) {
      window.showAssessment("baseline");
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    /* Evita a faixa de marca repetida que está incorporada no topo da arte. */
    .hero-art {
      background-size: 100% 112% !important;
      background-position: center bottom !important;
    }
    .hero-copy { display: none !important; }
    .assessment-group { padding: 18px 0; }
    .assessment-question { min-width: 0; }
    .assessment-question legend { display:block; width:100%; line-height:1.55; }
    .scale-options.scale-four {
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:8px;
    }
    .scale-four .scale-option {
      min-height:62px; margin:0; padding:10px 6px;
      display:flex; align-items:center; justify-content:center; gap:7px;
      border:1px solid #e0dfd4; border-radius:11px;
      background:#f8f5ed; text-align:center;
    }
    .scale-four .scale-option input { width:auto; margin:0; flex:0 0 auto; }
    .scale-four .scale-option span {
      display:inline; font:13px/1.3 Arial,sans-serif; color:#526b59;
    }
    #assessmentGate { position:relative; z-index:2; width:100%; max-height:none; overflow:visible; }
    #assessmentQuestions { max-height:none; overflow:visible; }
    body.assessment-open #journeyShell { display:none !important; }
    @media(max-width:650px) {
      .scale-options.scale-four { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .scale-four .scale-option { min-height:54px; }
      #assessmentGate { padding:20px 16px; }
      #assessmentGate h2 { font-size:25px; line-height:1.25; }
    }
  `;
  document.head.appendChild(style);
})();

    const incomplete = assessments.baseline && Object.keys(assessments.baseline.answers || {}).length < 20;
    if (incomplete) window.showAssessment("baseline");
  };
})();
