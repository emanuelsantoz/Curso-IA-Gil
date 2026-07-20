import { createFileRoute } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import logoAsset from "@/assets/logo_barracred.png.asset.json";
import oqueQueremosAsset from "@/assets/oquequeremos.png.asset.json";
import cerebroImg from "@/assets/ch-cerebro.png";
import conhecimentoImg from "@/assets/ch-conhecimento.png";
import habilidadesImg from "@/assets/ch-habilidades.png";
import contextoImg from "@/assets/ch-contexto.png";
import acaoImg from "@/assets/ch-acao.png";
import custosImg from "@/assets/custos.png";
import tokenVisualImg from "@/assets/token-visual.png";

const CHAPTER_IMAGES: Record<string, string> = {
  "CÉREBRO": cerebroImg,
  "CONHECIMENTO": conhecimentoImg,
  "CONTEXTO": contextoImg,
  "HABILIDADES": habilidadesImg,
  "AÇÃO": acaoImg,
};

export const Route = createFileRoute("/")({
  component: Presentation,
});

/* ---------- Layout primitives ---------- */

function SlideShell({
  chapter,
  children,
  align = "left",
  padded = true,
}: {
  chapter?: string;
  children: ReactNode;
  align?: "left" | "center";
  padded?: boolean;
}) {
  return (
    <div className="slide-content">
      {chapter && (
        <div
          className="slide-chapter-tag absolute flex items-center gap-4"
          style={{ top: 50, left: 90 }}
        >
          {Object.entries(CHAPTER_IMAGES).map(([name, img]) => (
            <img
              key={name}
              src={img}
              alt={name}
              style={{
                width: name === chapter ? 120 : 80,
                height: name === chapter ? 120 : 80,
                objectFit: "contain",
                filter: name === chapter ? "none" : "grayscale(100%)",
                border: name === chapter ? "4px solid #f97316" : "2px solid transparent",
                borderRadius: "50%",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
      <div
        className="absolute inset-0 flex flex-col"
        style={{
          paddingLeft: padded ? 110 : 0,
          paddingRight: padded ? 110 : 0,
          paddingTop: 180,
          paddingBottom: 120,
          justifyContent: align === "center" ? "center" : "flex-start",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <div className="slide-label mb-8">{children}</div>;
}

function Underline({ children }: { children: ReactNode }) {
  return <span className="accent-underline">{children}</span>;
}

function Card({ title, body, num }: { title: string; body?: string; num?: string }) {
  return (
    <div
      className="flex flex-col"
      style={{
        border: "2px solid #111",
        padding: "36px 40px",
        minHeight: 240,
      }}
    >
      {num && <div className="slide-label text-accent mb-4">{num}</div>}
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
        {title}
      </div>
      {body && (
        <div
          className="slide-body"
          style={{ color: "#444" }}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </div>
  );
}

/* ---------- Chapter divider ---------- */

function ChapterCover({
  num,
  name,
  image,
  range,
}: {
  num: string;
  name: string;
  image: string;
  range: string;
}) {
  return (
    <div className="slide-content">
      <div className="slide-chapter-tag absolute" style={{ top: 60, left: 110 }}>
        {range}
      </div>
      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: "1.1fr 0.9fr", alignItems: "center" }}
      >
        <div style={{ paddingLeft: 110 }}>
          <div className="slide-label mb-8">Capítulo {num}</div>
          <div className="slide-hero">
            <Underline>{name}</Underline>
          </div>
        </div>
        <div className="flex items-center justify-center" style={{ paddingRight: 110 }}>
          <img src={image} alt={name} style={{ width: 620, height: 620, objectFit: "contain" }} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Slides ---------- */

type Slide = { id: number; render: () => ReactNode; steps?: number };

/**
 * Contexto que expõe, dentro de cada slide, quantos elementos "passo"
 * já foram revelados pelo usuário. Quando `step` é 0, nada foi
 * revelado. Conforme o usuário clica/pressiona seta, o valor cresce até
 * `SLIDE.steps - 1`. Quando o número total é atingido, o próximo clique
 * avança para o slide seguinte.
 */
const StepContext = createContext<number>(0);
function useStep(): number {
  return useContext(StepContext);
}
function RevealIf({ stepIndex, children }: { stepIndex: number; children: ReactNode }) {
  const current = useStep();
  if (current < stepIndex) return null;
  return <>{children}</>;
}

const SLIDES: Slide[] = [
  // 1 — Cover
  {
    id: 1,
    render: () => (
      <div className="slide-content">
        <div className="absolute" style={{ top: 90, left: 110 }}>
          <img src={logoAsset.url} alt="Barracred" style={{ height: 110 }} />
        </div>
        <div
          className="absolute flex flex-col"
          style={{ left: 110, right: 110, top: 340 }}
        >
          <div className="slide-label mb-10">Formação Interna · Barracred</div>
          <div className="slide-hero" style={{ maxWidth: 1600 }}>
            Inteligência Artificial:<br />
            do <Underline>Cérebro</Underline> à <Underline>Ação</Underline>.
          </div>
          <div className="slide-statement mt-14" style={{ maxWidth: 1400, color: "#333" }}>
            Ferramentas mudam. Os conceitos permanecem. É essa base que te prepara para evoluir
          </div>
        </div>
      </div>
    ),
  },
  // 2 — O que queremos meme
  {
    id: 2,
    render: () => (
      <div className="slide-content flex items-center justify-center">
        <img
          src={oqueQueremosAsset.url}
          alt="O que queremos"
          style={{ maxWidth: "82%", maxHeight: "88%", objectFit: "contain" }}
        />
      </div>
    ),
  },
  // 3 — Mapa da apresentação (índice da jornada)
  {
    id: 3,
    render: () => (
      <SlideShell>
        <Label>Como vamos navegar</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Os <Underline>5 pilares</Underline> da nossa jornada.
        </div>
        <div className="slide-statement mb-12" style={{ maxWidth: 1400, color: "#333" }}>
          Cada capítulo destrincha um pilar — do motor da IA até a execução de tarefas reais.
        </div>
        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: "repeat(5, 1fr)", marginTop: 20 }}
        >
          {[
            { n: "01", t: "Cérebro (LLM)", i: cerebroImg },
            { n: "02", t: "Conhecimento", i: conhecimentoImg },
            { n: "03", t: "Contexto", i: contextoImg },
            { n: "04", t: "Habilidades", i: habilidadesImg },
            { n: "05", t: "Ação", i: acaoImg },
          ].map((c) => (
            <div key={c.n} className="flex flex-col items-center justify-center text-center">
              <img src={c.i} alt={c.t} style={{ width: 220, height: 220, objectFit: "contain" }} />
              <div className="slide-label" style={{ color: "#111", marginTop: 10 }}>{c.n}</div>
              <div style={{ fontSize: 32, fontWeight: 700, marginTop: 8, lineHeight: 1.1 }}>{c.t}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 4 — Cover Cérebro
  { id: 4, render: () => <ChapterCover num="01" name="Cérebro (LLM)" image={cerebroImg} range="" /> },
  // 5.1 — Evolução timeline (Parte 1)
  {
    id: 5,
    steps: 4,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Como chegamos até aqui</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          A <Underline>evolução</Underline> da IA.
        </div>
        <div className="relative" style={{ marginTop: 30 }}>
          <div style={{ height: 4, background: "#111", position: "absolute", top: 40, left: 0, right: 0 }} />
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { y: "Antiguidade", t: "O mito de Talos", d: "Origem do desejo de criar vida artificial." },
              { y: "1936–1950", t: "A era de Turing", d: "Máquina de Turing e o teste de Turing." },
              { y: "1956", t: "IA no campo acadêmico", d: "Dartmouth formaliza o termo IA." },
              { y: "1966", t: "Eliza", d: "Primeiro chatbot da história (psicóloga)." },
            ].map((step, i) => (
              <RevealIf key={step.y} stepIndex={i + 1}>
                <div className="flex flex-col items-start" style={{ paddingTop: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: '#ff6b00', marginBottom: 30 }} />
                  <div className="slide-label" style={{ color: "#111" }}>{step.y}</div>
                  <div style={{ fontSize: 30, fontWeight: 600, marginTop: 12, lineHeight: 1.2 }}>{step.t}</div>
                  <div className="slide-body" style={{ color: "#444", marginTop: 8 }}>{step.d}</div>
                </div>
              </RevealIf>
            ))}
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 5.2 — Evolução timeline (Parte 2)
  {
    id: 6,
    steps: 4,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Como chegamos até aqui</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          A <Underline>evolução</Underline> da IA.
        </div>
        <div className="relative" style={{ marginTop: 30 }}>
          <div style={{ height: 4, background: "#111", position: "absolute", top: 40, left: 0, right: 0 }} />
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { y: "1977–1997", t: "IA nos games", d: "Pac-Man e Deep Blue vencendo Kasparov." },
              { y: "Anos 80–2000", t: "Consolidação do ML", d: "SVMs, árvores de decisão e redes neurais." },
              { y: "2012 → hoje", t: "Era do deep learning", d: "AlexNet marca o início do boom das redes." },
              { y: "2022", t: "Lançamento das LLMs", d: "ChatGPT, Midjourney e os transformers." },
            ].map((step, i) => (
              <RevealIf key={step.y} stepIndex={i + 1}>
                <div className="flex flex-col items-start" style={{ paddingTop: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: '#ff6b00', marginBottom: 30 }} />
                  <div className="slide-label" style={{ color: "#111" }}>{step.y}</div>
                  <div style={{ fontSize: 30, fontWeight: 600, marginTop: 12, lineHeight: 1.2 }}>{step.t}</div>
                  <div className="slide-body" style={{ color: "#444", marginTop: 8 }}>{step.d}</div>
                </div>
              </RevealIf>
            ))}
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 5.3 — Evolução timeline (Parte 3)
  {
    id: 7,
    steps: 4,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Como chegamos até aqui</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          A <Underline>evolução</Underline> da IA.
        </div>
        <div className="relative" style={{ marginTop: 30 }}>
          <div style={{ height: 4, background: "#111", position: "absolute", top: 40, left: 0, right: 0 }} />
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { y: "2023", t: "Multimodalidade", d: "Interpretação de imagem, áudio e texto juntos." },
              { y: "2024", t: "Vídeo e tempo real", d: "Geração de vídeo realista baseada em física." },
              { y: "2024–2025", t: "Raciocínio avançado", d: "Modelos aprendem a pensar e se autocorrigir." },
              { y: "2026", t: "Agentes autônomos", d: "IAs passam a executar tarefas complexas sozinhas." },
            ].map((step, i) => (
              <RevealIf key={step.y} stepIndex={i + 1}>
                <div className="flex flex-col items-start" style={{ paddingTop: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 999, background: '#ff6b00', marginBottom: 30 }} />
                  <div className="slide-label" style={{ color: "#111" }}>{step.y}</div>
                  <div style={{ fontSize: 30, fontWeight: 600, marginTop: 12, lineHeight: 1.2 }}>{step.t}</div>
                  <div className="slide-body" style={{ color: "#444", marginTop: 8 }}>{step.d}</div>
                </div>
              </RevealIf>
            ))}
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 6.1 — LLMs
  {
    id: 8,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>O motor da IA generativa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O que são <Underline>LLMs</Underline>?
        </div>
        <div className="slide-statement mb-16" style={{ maxWidth: 1400, color: "#333" }}>
          Large Language Models são modelos treinados em enormes volumes de texto para prever a próxima palavra, permitindo conversar, escrever e raciocinar.
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Card num="Texto" title="LLMs" body="Chat, resumo, redação e análise." />
          <Card num="Visão" title="Multimodais" body="Interpretam imagens, áudio e vídeo." />
          <Card num="Ação" title="Modelos de raciocínio" body="Pensam por etapas antes de responder." />
        </div>
      </SlideShell>
    ),
  },
  // 6.2 — Por baixo do capô
  {
    id: 9,
    steps: 5,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Por baixo do capô</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Como a LLM <Underline>funciona</Underline>?
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
          {[
            { n: "01", t: "Encode & Tokenização", d: "O texto é quebrado em pedaços (tokens) e convertido em números." },
            { n: "02", t: "Embedding", d: "Cada token ganha significado e posição em um mapa matemático." },
            { n: "03", t: "Attention", d: "O modelo analisa quais palavras do contexto importam mais para a atual." },
            { n: "04", t: "Transformer", d: "A rede neural processa tudo em paralelo, conectando o raciocínio." },
            { n: "05", t: "Decode", d: "Os números são transformados de volta em texto como resposta final." },
          ].map((step, i) => (
            <RevealIf key={step.n} stepIndex={i + 1}>
              <div style={{ borderLeft: "4px solid #ff6b00", paddingLeft: 20 }}>
                <div className="slide-label" style={{ color: "#111" }}>{step.n}</div>
                <div style={{ fontSize: 26, fontWeight: 700, marginTop: 14, lineHeight: 1.15 }}>{step.t}</div>
                <div className="slide-body" style={{ color: "#444", marginTop: 10, fontSize: 20 }}>{step.d}</div>
              </div>
            </RevealIf>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 7 — Modelos populares
  {
    id: 10,
    steps: 4,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Panorama atual</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          Modelos mais <Underline>populares</Underline> hoje.
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { b: "OpenAI", m: "GPT-5.6<br />Sol / Lua / Terra" },
            { b: "Anthropic", m: "Claude Fable 5<br />Mythos 5<br />Opus 8" },
            { b: "Google", m: "Gemini Nano Banano<br />Pro / Ultra" },
            { b: "Open source", m: "Llama<br />DeepSeek v4" },
          ].map((x, i) => (
            <RevealIf key={x.b} stepIndex={i + 1}>
              <div style={{ borderLeft: "4px solid #ff6b00", paddingLeft: 24 }}>
                <div className="slide-label" style={{ color: "#111" }}>{x.b}</div>
                <div style={{ fontSize: 34, fontWeight: 700, marginTop: 14, lineHeight: 1.15 }} dangerouslySetInnerHTML={{ __html: x.m }} />
              </div>
            </RevealIf>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 7.1 — Harness (orquestração ao redor do LLM)
  {
    id: 11,
    steps: 7,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Por trás das plataformas</Label>
        <div className="slide-title mb-8" style={{ maxWidth: 1500 }}>
          Orquestração: o conceito de <Underline>Harness</Underline>.
        </div>
        <div className="slide-statement mb-10" style={{ maxWidth: 1400, color: "#333" }}>
          O Harness funciona como o Sistema Operacional que envolve o modelo. Ele fornece o contexto de negócios, a estrutura e as limitações.
        </div>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto auto",
            gridTemplateAreas: `
              "fs . guides"
              "state llm sensors"
              "memory . tools"
            `,
            gap: 24,
            alignItems: "stretch",
          }}
        >
          <RevealIf stepIndex={2}>
            <div style={{ gridArea: "fs" }}>
              <Card num="01" title="File System" body="Acesso seguro à árvore de diretórios." />
            </div>
          </RevealIf>
          <RevealIf stepIndex={3}>
            <div style={{ gridArea: "guides" }}>
              <Card num="02" title="Guias (Guides)" body="Instruções operacionais e Skills injetadas." />
            </div>
          </RevealIf>
          <RevealIf stepIndex={4}>
            <div style={{ gridArea: "state" }}>
              <Card num="03" title="Estado (State)" body="Rastreamento em tempo real da tarefa atual." />
            </div>
          </RevealIf>
          <RevealIf stepIndex={1}>
            <div
              style={{
                gridArea: "llm",
                border: "4px solid #ff6b00",
                background: "#fff5ec",
                padding: "48px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 240,
              }}
            >
              <div className="slide-label" style={{ color: "#ff6b00" }}>Núcleo</div>
              <div style={{ fontSize: 42, fontWeight: 700, marginTop: 8 }}>LLM</div>
              <div className="slide-body" style={{ color: "#444", marginTop: 8, textAlign: "center" }}>
                A inteligência bruta. Sem o Harness, está presa ao próprio ecossistema.
              </div>
            </div>
          </RevealIf>
          <RevealIf stepIndex={5}>
            <div style={{ gridArea: "sensors" }}>
              <Card num="04" title="Sensores (Sensors)" body="Percepção e leitura do ambiente de desenvolvimento." />
            </div>
          </RevealIf>
          <RevealIf stepIndex={6}>
            <div style={{ gridArea: "memory" }}>
              <Card num="05" title="Memória (Memory)" body="Retenção de contexto a curto e longo prazo." />
            </div>
          </RevealIf>
          <RevealIf stepIndex={7}>
            <div style={{ gridArea: "tools" }}>
              <Card num="06" title="Ferramentas (Tools)" body="Capacidades de execução via MCP e APIs." />
            </div>
          </RevealIf>
        </div>
        <RevealIf stepIndex={7}>
          <div
            className="slide-statement mt-10"
            style={{
              maxWidth: 1500,
              padding: "20px 28px",
              border: "2px solid #111",
              background: "#fafafa",
              color: "#333",
            }}
          >
            <strong>Nota arquitetural:</strong> o mesmo LLM, envolto em um Harness diferente, produzirá resultados comportamentais completamente distintos.
          </div>
        </RevealIf>
      </SlideShell>
    ),
  },
  // 8.1 — O que é um token?
  {
    id: 12,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>A unidade que o modelo "enxerga"</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O que é um <Underline>token</Underline>?
        </div>
        <div className="slide-statement mb-14" style={{ maxWidth: 1500, color: "#333" }}>
          A IA não lê palavras como nós, ela lê fragmentos chamados tokens. Tudo que entra e sai é medido assim.
        </div>
        <div className="grid gap-10" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Card num="Palavras Curtas" title="1 Token" body="Exemplo: 'gato', 'sol', 'IA'" />
          <Card num="Palavras Longas" title="2+ Tokens" body="Exemplo: 'Inconstitucional' = In + consti + tu + cional" />
          <Card num="Média" title="~5 caracteres" body="Equivale a cerca de 1 token em português." />
        </div>
      </SlideShell>
    ),
  },
  // 8.2 — Limitações de Contexto
  {
    id: 13,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Janela de Contexto</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          <Underline>Limitações</Underline> de memória.
        </div>
        <div className="slide-statement mb-14" style={{ maxWidth: 1500, color: "#333" }}>
          Cada modelo tem um limite de quantos tokens consegue "lembrar" de uma única vez.
        </div>
        <div className="grid gap-10" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          <div>
            <div className="slide-num text-accent">200k</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>Modelos Usuais</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              Equivale a um livro de 400 páginas (ex: GPT-4o, Claude 3.5 Sonnet).
            </div>
          </div>
          <div>
            <div className="slide-num text-accent">1M a 2M+</div>
            <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>Modelos Avançados</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              Equivale a milhares de PDFs, vídeos ou bases de código inteiras (ex: Gemini 1.5 Pro).
            </div>
          </div>
        </div>
      </SlideShell>
    ),
  },
  // 10 — Custos
  {
    id: 14,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <Label>Você paga pelo que usa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          <Underline>Custos</Underline> por token.
        </div>
        <div className="grid gap-10 items-end" style={{ gridTemplateColumns: "repeat(4, 1fr)", height: 380 }}>
          {[
            { m: "Modelo econômico", h: 40, p: "US$ 0,30 + US$ 2,5 / 1M" },
            { m: "Modelo para uso geral", h: 60, p: "US$ 0,50 + US$ 3 / 1M" },
            { m: "Modelo para planejar", h: 140, p: "US$ 3 + US$ 15 / 1M" },
            { m: "Modelo mais avançado", h: 340, p: "US$ 10 + US$ 50 / 1M" },

          ].map((b, i) => (
            <div key={b.m} className="flex flex-col items-start h-full justify-end">
              <div
                style={{
                  width: "100%",
                  height: b.h,
                  background: i === 3 ? "#ff6b00" : "#111",
                }}
              />
              <div className="slide-label" style={{ color: "#111", marginTop: 20 }}>{b.m}</div>
              <div style={{ fontSize: 26, fontWeight: 600, marginTop: 8 }}>{b.p}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 11 — Custos imagem
  {
    id: 15,
    render: () => (
      <SlideShell chapter="CÉREBRO">
        <div className="flex items-center justify-center h-full w-full">
          <img
            src={custosImg}
            alt="Custos"
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
      </SlideShell>
    ),
  },
  // 12 — Cover Conhecimento
  { id: 16, render: () => <ChapterCover num="02" name="Conhecimento" image={conhecimentoImg} range="" /> },
  // 13 — Assistentes web
  {
    id: 17,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Onde conversamos com a IA</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          <Underline>Assistentes web</Underline> por chat.
        </div>
        <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <Card num="OpenAI" title="ChatGPT" body="O mais conhecido. Forte em texto, imagem e voz." />
          <Card num="Google" title="Gemini" body="Integrado ao Workspace, YouTube e Google Search." />
          <Card num="Anthropic" title="Claude" body="Ótimo para textos longos e análise de documentos." />
        </div>
      </SlideShell>
    ),
  },
  // 14 — Projeto no ChatGPT
  {
    id: 18,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Memória de trabalho</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          <Underline>Projetos</Underline> no ChatGPT.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Um agrupador de instruções fixas, arquivos e histórico próprios.
        </div>
      </SlideShell>
    ),
  },
  // 15 — NotebookLM
  {
    id: 19,
    render: () => (
      <SlideShell chapter="CONHECIMENTO">
        <Label>Base de fontes confiáveis</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          PDFs e vídeos no <Underline>NotebookLM</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Suba manuais, atas, resoluções do Bacen e vídeos do YouTube. A IA responde citando exatamente o trecho de origem.
        </div>
      </SlideShell>
    ),
  },
  // 16 — Cover Contexto
  { id: 20, render: () => <ChapterCover num="03" name="Contexto" image={contextoImg} range="" /> },
  // 17 — O que é contexto
  {
    id: 21,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>O ingrediente que muda tudo</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O que é <Underline>contexto</Underline>?
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}><br />
          São as definições que a IA recebe para entender quem você é, o que você quer e como deve responder. Sem contexto, ela <strong>chuta o que faltou definir</strong> ou deixa genérico.
        </div>
      </SlideShell>
    ),
  },
  // 18 — Anatomia
  {
    id: 22,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Como se monta um bom prompt</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          A <Underline>anatomia</Underline> de um prompt.
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { n: "01", t: "Personificação (Role)", d: "Quem a IA deve parecer ser.", letter:"R" },
            { n: "02", t: "Tarefa, Objetivo", d: "O que você quer alcançar.", letter:"T" },
            { n: "03", t: "Contexto adicional", d: "Especificações, arquivos, material, restrições, exemplos, público-alvo", letter:"C" },
            { n: "04", t: "Formato", d: "Formato esperado.", letter:"F" },
          ].map((x, i) => (
            <div key={x.n}> <br/>
              <div style={{ fontSize: 84, fontWeight: 700, marginTop: 10, borderBottom: `6px solid #111`, paddingTop: 20, color: x.letter == "C" ? "#ff6b00" : "#111" }}>{x.letter}</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 10 }}>{x.t}</div>
              <div className="slide-body" style={{ color: "#555", marginTop: 8 }}>{x.d}</div>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 19 — Exercício falado
  {
    id: 23,
    render: () => (
      <SlideShell chapter="CONTEXTO" align="center">
        <Label>Pausa para reflexão</Label>
        <div className="slide-hero" style={{ maxWidth: 1600 }}>
          Vamos fazer um exercício <Underline>falado</Underline>?
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          <br />Qual é o prompt para uma nova campanha de marketing?<br /><br />
        </div>
      </SlideShell>
    ),
  },
  // 20 — Mão na massa: contexto
  {
    id: 24,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 1/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          O poder da <Underline>personificação</Underline>
        </div>
        <br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#000" }}>
          <strong>Atue como um arquiteto de software com 20 anos de experiência, especialista em sistemas críticos e mentor de equipes de desenvolvimento.</strong><br />
          Explique como melhorar a qualidade de um software.
        </div>
      </SlideShell>
    ),
  },
  // 21 — Mão na massa: exemplo
  {
    id: 25,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 2/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Instruir através de <Underline>exemplo</Underline>
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Um bom exemplo vale mais do que dez linhas explicando.
        </div><br />
        <ul className="slide-statement list-disc list-inside pl-6" style={{ maxWidth: 1500, color: "#333" }}>
          <li>User story de implementação autenticação via Google</li>
          <li>Pull request de bugfix de timeout na integração com o serviço de pagamentos</li>
          <li>Histórico de consumo de tokens</li>
        </ul>
      </SlideShell>
    ),
  },
  // 22 — Cadeia de pensamento
  {
    id: 26,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 3/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Pensando em <Underline>etapas</Underline>.
        </div><br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          <strong>Vamos resolver este problema em etapas. Após responder, aguarde minha confirmação para continuar o assunto.</strong>
          <br /><br />
          Primeiro: identifique os principais desafios da migração.
        </div><br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Agora proponha uma arquitetura.
        </div>
      </SlideShell>
    ),
  },
  // 23 — Iteração
  {
    id: 27,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>Exercício 4/4 · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Construindo prompt por <Underline>iteração com IA</Underline>
        </div>
        <br /><br />
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          <br />Quero criar .... <br />
          <strong>Antes de responder, faça todas as perguntas necessárias para entender o problema. Não faça suposições. Somente depois que eu responder às perguntas, elabore a solução.</strong>
        </div>
      </SlideShell>
    ),
  },
    // 15 — Markdown
  {
    id: 28,
    render: () => (
      <SlideShell chapter="CONTEXTO">
        <Label>O formato preferido das IAs</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Prompts <Underline>reutilizáveis</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Através de arquivo de instruções na forma de texto simples é possível especificar, descrever experiências, processos e conhecimentos reutilizáveis.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333", marginTop: 80 }}>
          Tá, mas como faço isso no ChatGPT/Gemini?
        </div>
      </SlideShell>
    ),
  },
  // 24 — Cover Habilidades
  { id: 29, render: () => <ChapterCover num="04" name="Habilidades" image={habilidadesImg} range="" /> },

  // 25 — Skills
  {
    id: 30,
    render: () => (
      <SlideShell chapter="HABILIDADES">
        <Label>Do prompt à execução</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          Habilidades <Underline>customizadas</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Skills são procedimentos, instruções, comportamentos que a IA aprende uma vez e as executam sempre da mesma forma.
        </div>
      </SlideShell>
    ),
  },
  // 26 — Exemplos skills
  {
    id: 31,
    render: () => (
      <SlideShell chapter="HABILIDADES">
        <Label>O que já é possível automatizar</Label>
        <div className="slide-title mb-14" style={{ maxWidth: 1500 }}>
          Exemplos de <Underline>skills</Underline>.
        </div>
        <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { n: "Administrativo", t: "Ata resumida a partir da gravação da reunião" },
            { n: "Crédito", t: "Sumário de proposta com pontos de atenção" },
            { n: "Atendimento", t: "Resposta padrão de e-mail com tom da marca" },
            { n: "Compliance", t: "Revisão de contrato contra política interna" },
            { n: "Humanizer", t: "Especialista em remover marcas de escrita por IA - <a href='https://www.skills.sh/mackswendhell/humanizer-pt-br/humanizer-pt-br ' target='_blank'>Acessar link</a>" },
            { n: "Book-to-Skill", t: "Transforme livro técnico em skill - <a href='https://github.com/virgiliojr94/book-to-skill' target='_blank'>Acessar link</a>" },
            { n: "html-to-png", t: "Transforme HTML em imagem PNG - <a href='/html-to-image.md' target='_blank'>Acessar link</a>" },
            { n: "Video-to-Skill", t: "Transforme vídeo do YouTube em skill - <a href='https://gemini.google.com/' target='_blank'>Acessar link</a>" },
            { n: "Histórico de prompts", t: "Prompts usados, modelos e custos estimados - <a href='/consumo.md' target='_blank'>Acessar link</a>" },
          ].map((s) => (
            <div key={s.n} style={{ borderLeft: "4px solid #ff6b00", paddingLeft: 20 }}>
              <div className="slide-label" style={{ color: "#111" }}>{s.n}</div>
              <div
                style={{ fontSize: 28, fontWeight: 600, marginTop: 10, lineHeight: 1.25 }}
                dangerouslySetInnerHTML={{ __html: s.t }}
              />
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },
  // 27 — Cover Ação
  { id: 32, render: () => <ChapterCover num="05" name="Ação" image={acaoImg} range="" /> },

  // 27.1 — Anatomia Estrutural de um Agente
  {
    id: 33,
    render: () => (
      <SlideShell chapter="AÇÃO">
        <Label>Recapitulando</Label>
        <div className="slide-title mb-12" style={{ maxWidth: 1500 }}>
          A anatomia estrutural de um <Underline>agente</Underline>.
        </div>
        <div
          className="grid items-stretch"
          style={{
            gridTemplateColumns: "1fr auto 1fr auto 1fr auto 1fr",
            gap: 16,
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <div
            style={{
              border: "2px solid #111",
              padding: "32px 28px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="slide-label" style={{ color: "#111" }}>[ CÉREBRO ]</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>LLM (Claude)</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              A inteligência bruta, o raciocínio probabilístico e a capacidade de interpretação.
            </div>
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#3b82f6", textAlign: "center" }}>+</div>
          <div
            style={{
              border: "2px solid #111",
              padding: "32px 28px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="slide-label" style={{ color: "#111" }}>[ FERRAMENTAS ]</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>MCP Servers / APIs / Web</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              Os "braços" executivos que permitem manipular arquivos e dados externos.
            </div>
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#3b82f6", textAlign: "center" }}>+</div>
          <div
            style={{
              border: "2px solid #111",
              padding: "32px 28px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="slide-label" style={{ color: "#111" }}>[ LOOP REACT ]</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>Pense → Aja → Observe</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              A autonomia iterativa para buscar um objetivo até sua conclusão.
            </div>
          </div>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#16a34a", textAlign: "center" }}>=</div>
          <div
            style={{
              border: "4px solid #16a34a",
              background: "#f0fdf4",
              padding: "32px 28px",
              minHeight: 280,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div className="slide-label" style={{ color: "#16a34a" }}>[ AGENTE AUTÔNOMO ]</div>
            <div style={{ fontSize: 30, fontWeight: 700, marginTop: 8 }}>Entidade capaz de agir</div>
            <div className="slide-body" style={{ color: "#444", marginTop: 10 }}>
              Recebe um objetivo, traça um plano, utiliza ferramentas e corrige a própria rota de forma independente.
            </div>
          </div>
        </div>
        <div
          className="slide-statement mt-12"
          style={{
            maxWidth: 1500,
            padding: "20px 28px",
            border: "2px solid #111",
            background: "#fafafa",
            color: "#333",
          }}
        >
          <strong>Nota arquitetural:</strong> sem ferramentas ou sem o loop iterativo, você tem apenas um modelo de linguagem brilhante preso em seu próprio ecossistema.
        </div>
      </SlideShell>
    ),
  },

  // 28 — Juntando tudo
  {
    id: 34,
    render: () => (
      <SlideShell chapter="AÇÃO">
        <Label>Exercício final · Mão na massa</Label>
        <div className="slide-title mb-10" style={{ maxWidth: 1500 }}>
          <Underline>Juntando tudo</Underline>.
        </div>
        <div className="slide-statement" style={{ maxWidth: 1500, color: "#333" }}>
          Escolha algo que você faz toda semana transforme uma <Underline>Skill</Underline>.<br />
          Pode ser, por exemplo:
          <ul className="list-disc list-inside pl-6">
            <li>Gerar Pull Request mais detalhada. <a href='/pr.md' target='_blank'>Exemplo</a></li>
            <li>Criar User Stories. <a href='/userstory.md' target='_blank'>Exemplo</a></li>
            <li>Escrever casos de teste.</li>
            <li>Escrever teste unitário.</li>
            <li>Gerar documentação do projeto, caso não tenha.</li>
            <li>Escrever consultas SQL.</li>
            <li>Analisar logs.</li>
          </ul>
        </div>
      </SlideShell>
    ),
  },
  // 29 — Encerramento meme
  {
    id: 35,
    render: () => (
      <div className="slide-content flex items-center justify-center">
        <img
          src={oqueQueremosAsset.url}
          alt="O que queremos"
          style={{ maxWidth: "82%", maxHeight: "88%", objectFit: "contain" }}
        />
      </div>
    ),
  },
  // 30 — Agradecimento
  {
    id: 36,
    render: () => (
      <div className="slide-content flex flex-col items-center justify-center text-center px-[200px]">
        <div className="slide-statement mb-12" style={{ maxWidth: 1400, fontSize: 42, color: "#444" }}>
          <strong>Ontem:</strong><br /> você apenas conversava com a IA. ("oi chat")
        </div>
        <div className="slide-title mb-12" style={{ maxWidth: 1100, fontSize: 60, lineHeight: 1.1 }}>
          Hoje:<br /> você extrai melhor informação, e<br /> cria habilidades reutilizáveis para futuros agentes.
        </div><br /><br />
        <div className="slide-statement" style={{ maxWidth: 1200, color: "#444", fontSize: 42 }}>
          <strong>No próximo módulo:</strong><br />
          🔄 Fluxos que executam sequência de tarefas<br />
          ⚙️ Pequenas automações dinâmicas<br />
          📅 Agendamento de ações diárias<br />
        </div>
      </div>
    ),
  },

];

/* ---------- Presentation shell ---------- */

function Presentation() {
  const [index, setIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const p = new URLSearchParams(window.location.search).get("slide");
    const n = p ? parseInt(p, 10) : 1;
    return Math.min(Math.max((isNaN(n) ? 1 : n) - 1, 0), SLIDES.length - 1);
  });

  // `step` controla quantos elementos de um slide já foram revelados.
  // É resetado toda vez que o slide atual muda.
  const [step, setStep] = useState(0);

  const go = useCallback((next: number) => {
    setIndex((cur) => {
      const clamped = Math.min(Math.max(next, 0), SLIDES.length - 1);
      const url = new URL(window.location.href);
      url.searchParams.set("slide", String(clamped + 1));
      window.history.replaceState({}, "", url.toString());
      return clamped;
    });
    setStep(0);
  }, []);

  const advance = useCallback(() => {
    const current = SLIDES[index];
    const max = current?.steps ?? 0;
    if (max > 0 && step < max) {
      // Revela a próxima etapa sem trocar de slide.
      setStep(step + 1);
      return;
    }
    // Todas as etapas já foram reveladas (ou slide sem etapas): avança.
    const clamped = Math.min(index + 1, SLIDES.length - 1);
    setIndex(clamped);
    setStep(0);
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(clamped + 1));
    window.history.replaceState({}, "", url.toString());
  }, [index, step]);

  const back = useCallback(() => {
    const current = SLIDES[index];
    const max = current?.steps ?? 0;
    if (max > 0 && step > 0) {
      // Esconde a última etapa revelada.
      setStep(step - 1);
      return;
    }
    // Volta para o slide anterior.
    const clamped = Math.max(index - 1, 0);
    setIndex(clamped);
    setStep(0);
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(clamped + 1));
    window.history.replaceState({}, "", url.toString());
  }, [index, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        back();
      } else if (e.key === "Home") {
        setIndex(0);
        setStep(0);
        const url = new URL(window.location.href);
        url.searchParams.set("slide", "1");
        window.history.replaceState({}, "", url.toString());
      } else if (e.key === "End") {
        const last = SLIDES.length - 1;
        setIndex(last);
        setStep(0);
        const url = new URL(window.location.href);
        url.searchParams.set("slide", String(last + 1));
        window.history.replaceState({}, "", url.toString());
      } else if (e.key === "f" || e.key === "F") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, back]);

  useEffect(() => {
    document.title = `${index + 1}/${SLIDES.length} · Inteligência Artificial — Barracred`;
  }, [index]);

  // Fit scale
  const stageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  useLayoutEffect(() => {
    const update = () => {
      if (!stageRef.current) return;
      const { clientWidth: w, clientHeight: h } = stageRef.current;
      setScale(Math.min(w / 1920, h / 1080));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "#f5f5f5" }}>
      <div ref={stageRef} className="relative flex-1 overflow-hidden">
        <div className="slide-wrapper" style={{ transform: `scale(${scale})` }}>
          <StepContext.Provider value={step}>
            {slide.render()}
          </StepContext.Provider>
        </div>
      </div>

      {/* Controls */}
      <div
        className="fixed flex items-center gap-3 px-4 py-2 rounded-full"
        style={{
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 24,
          background: "rgba(17,17,17,0.85)",
          color: "white",
          backdropFilter: "blur(6px)",
          fontFamily: "Poppins",
        }}
      >
        <button
          onClick={back}
          className="px-3 py-1 text-sm font-medium hover:opacity-70"
          aria-label="Anterior"
        >
          ←
        </button>
        <div className="text-sm tabular-nums" style={{ minWidth: 60, textAlign: "center" }}>
          {index + 1} / {SLIDES.length}
        </div>
        <button
          onClick={advance}
          className="px-3 py-1 text-sm font-medium hover:opacity-70"
          aria-label="Próximo"
        >
          →
        </button>
        {(() => {
          const max = SLIDES[index]?.steps ?? 0;
          if (max === 0) return null;
          return (
            <div
              className="flex items-center gap-1 ml-2 pl-3"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.3)" }}
              aria-label="Progresso das etapas"
            >
              {Array.from({ length: max }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: i < step ? "#ff6b00" : "rgba(255,255,255,0.3)",
                    transition: "background 0.2s ease",
                  }}
                />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
