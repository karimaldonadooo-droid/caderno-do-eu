/* Caderno do Eu — avaliação integrada: 20 afirmações, quatro respostas */
(function () {
  if (window.__cadernoAssessmentV4) return;
  window.__cadernoAssessmentV4 = true;

  const extra = [
    ["Emoções", ["Consigo compreender o que pode estar despertando minhas emoções.", "Permito-me sentir sem julgar ou reprimir imediatamente o que sinto."]],
    ["Autoestima", ["Sinto que tenho valor, independentemente da aprovação das outras pessoas.", "Sinto-me merecedora de amor, respeito e coisas boas."]],
    ["Limites e escolhas", ["Tenho facilidade para dizer não quando algo ultrapassa meus limites.", "Consigo expressar minhas opiniões e vontades com clareza."]],
    ["Autocuidado e corpo", ["Consigo reservar momentos para cuidar de mim sem sentir culpa.", "Respeito meu corpo e procuro acolher suas necessidades."]],
    ["Propósito e perspectivas", ["Consigo reconhecer desejos e sonhos que são importantes para mim.", "Tenho esperança na possibilidade de construir uma vida mais alinhada comigo mesma."]]
  ];
  extra.forEach((g, i) => {
    if (assessmentItems[i].items.length === 2) assessmentItems[i].items.push(...g[1]);
  });

  const options = [
    { value: 1, label: "Concordo", score: 3 },
    { value: 2, label: "Discordo", score: 1 },
    { value: 3, label: "Mais ou menos", score: 2 },
    { value: 4, label: "Não tenho certeza", score: null }
  ];

  window.assessmentMarkup = function () {
    return assessmentItems.map((g, gi) =>
      `<section class="assessment-group"><h3>${g.dimension}</h3>` +
      g.items.map((q, qi) => {
        const id = `a${gi * 4 + qi}`;
        return `<fieldset class="assessment-question"><legend>${q}</legend><div class="scale-options scale-four">` +
          options.map(o => `<label class="scale-option"><input type="radio" name="${id}" value="${o.value}"><span>${o.label}</span></label>`).join("") +
          `</div></fieldset>`;
      }).join("") + `</section>`
    ).join("");
  };

  function removeLegacyDuplicates() {
    const gates = Array.from(document.querySelectorAll('[id="assessmentGate"]'));
    const modernGate = gates.find(g => g.querySelector(".scale-four"));
    if (modernGate) {
      gates.filter(g => g !== modernGate).forEach(g => g.remove());
      modernGate.querySelectorAll(".assessment-group").forEach(group => {
        if (group.querySelector(".scale-options:not(.scale-four)")) group.remove();
      });
    }
  }

  window.showAssessment = function (stage) {
    const gates = Array.from(document.querySelectorAll('[id="assessmentGate"]'));
    const gate = gates[0] || document.getElementById("assessmentGate");
    const shell = document.getElementById("journeyShell");
    if (!gate) return;
    gates.slice(1).forEach(g => g.remove());
    gate.classList.remove("hidden");
    shell.classList.add("hidden");
    gate.style.display = "block";
    shell.style.display = "none";
    document.body.classList.add("assessment-open");

    document.getElementById("assessmentTitle").textContent =
      stage === "baseline" ? "Antes de começar, vamos olhar para você?" : "Você chegou ao fim dos 30 dias. Como se percebe agora?";
    document.getElementById("assessmentIntro").textContent =
      "Responda pensando em como você se sente hoje. Não existe resposta certa ou errada. Se estiver em dúvida, escolha “Não tenho certeza”.";
    document.getElementById("assessmentQuestions").innerHTML = window.assessmentMarkup();

    const previous = assessments[stage]?.answers || {};
    if (Object.keys(previous).length >= 20) {
      Object.entries(previous).forEach(([key, value]) => {
        const input = document.querySelector(`input[name="${key}"][value="${value}"]`);
        if (input) input.checked = true;
      });
    }

    const message = document.getElementById("assessmentMsg");
    const button = document.getElementById("saveAssessment");
    message.textContent = "";
    button.disabled = false;
    button.onclick = async () => {
      const answers = {};
      for (let i = 0; i < 20; i++) {
        const selected = document.querySelector(`input[name="a${i}"]:checked`);
        if (!selected) {
          message.textContent = `Falta responder à afirmação ${i + 1}. Escolha uma das quatro opções para continuar.`;
          document.querySelector(`input[name="a${i}"]`)?.closest(".assessment-question")?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        answers[`a${i}`] = Number(selected.value);
      }
      const scores = {};
      assessmentItems.forEach((g, gi) => {
        const valid = g.items.map((_, qi) => options.find(o => o.value === answers[`a${gi * 4 + qi}`])?.score ?? null)
          .filter(score => score !== null);
        scores[g.dimension] = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
      });
      button.disabled = true;
      message.textContent = "Salvando sua avaliação...";
      const { error } = await db.from("caderno_assessments").upsert({
        user_id: user.id, stage, answers, dimension_scores: scores, completed_at: new Date().toISOString()
      }, { onConflict: "user_id,stage" });
      button.disabled = false;
      if (error) {
        message.textContent = "Não foi possível salvar. Tente novamente ou avise a terapeuta.";
        return;
      }
      assessments[stage] = { answers, dimension_scores: scores };
      gate.classList.add("hidden");
      gate.style.display = "";
      shell.classList.remove("hidden");
      shell.style.display = "";
      document.body.classList.remove("assessment-open");
      window.renderAssessmentChart();
    };
    removeLegacyDuplicates();
  };

  window.renderAssessmentChart = function () {
    const canvas = document.getElementById("assessmentChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d"), w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const names = assessmentItems.map(x => x.dimension);
    const left = 190, right = 28, top = 24, bottom = 28, plotW = w - left - right, rowH = (h - top - bottom) / names.length;
    ctx.font = "13px Arial"; ctx.fillStyle = "#687565"; ctx.strokeStyle = "#e5e6dc";
    ["Discordo", "Mais ou menos", "Concordo"].forEach((label, i) => {
      const x = left + i * plotW / 2;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x, h - bottom); ctx.stroke();
      ctx.fillText(label, x - 32, h - 7);
    });
    names.forEach((name, i) => {
      const y = top + i * rowH + rowH / 2;
      ctx.fillStyle = "#596657"; ctx.fillText(name, left - 175, y + 4);
      const a = assessments.baseline?.dimension_scores?.[name], b = assessments.final?.dimension_scores?.[name];
      if (a != null) { ctx.fillStyle = "#b48b55"; ctx.fillRect(left, y - 13, Math.max(0, (a - 1) * plotW / 2), 9); }
      if (b != null) { ctx.fillStyle = "#729779"; ctx.fillRect(left, y + 1, Math.max(0, (b - 1) * plotW / 2), 9); }
    });
    const note = document.getElementById("assessmentChartNote");
    if (note) note.textContent = assessments.final
      ? "Comparação das respostas no início e ao final da jornada. “Não tenho certeza” não entra no cálculo das médias."
      : "Este é seu ponto de partida. A comparação final aparecerá quando você concluir os 30 dias e responder novamente.";
  };

  // Remove apenas painéis de avaliação duplicados da versão anterior.
  const observer = new MutationObserver(removeLegacyDuplicates);
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const style = document.createElement("style");
  style.textContent = `
    .hero-art { background-size: 100% 112% !important; background-position: center bottom !important; }
    .hero-copy { display: none !important; }
    .scale-options.scale-four { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; }
    .scale-four .scale-option { min-height:62px; margin:0; padding:10px 6px; display:flex; align-items:center; justify-content:center; gap:7px; border:1px solid #e0dfd4; border-radius:11px; background:#f8f5ed; text-align:center; }
    .scale-four .scale-option input { width:auto; margin:0; flex:0 0 auto; }
    .scale-four .scale-option span { display:inline; font:13px/1.3 Arial,sans-serif; color:#526b59; }
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
  removeLegacyDuplicates();
})();
