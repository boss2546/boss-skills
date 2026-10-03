# Handoff: Boss Library x nashsu/llm_wiki cloud continuation

## User / Naming
- User is บอส.
- “มาย / มายมิ้น” refers to the assistant persona, not the user.
- Respond in concise, warm Thai unless the user asks for detailed planning.

## Core Goal
บอส wants to continue this exact work on cloud/VPS, not lose the thinking from the local Mac session.

Main product concept:
- **Boss Library** is the main concept/product.
- It is บอส’s personal library, not a generic LLM Wiki.
- Maymint acts as librarian/secretary/co-thinker: receive raw information, organize it, summarize, write/refine notes, connect related ideas, and help reuse the knowledge.
- Use Karpathy’s LLM Wiki idea only as **backend anti-chaos rules**, not as the user-facing identity.

Key sentence to preserve:
> Boss Library เป็นตัวหลัก แล้วเอาของ Karpathy มาเสริมเป็น “กฎกันมั่วหลังบ้าน” เท่านั้น

## Desired Boss Library Structure
Initial conceptual structure:
```text
Boss-Library/
  00-Inbox/
  01-Roles/
    Employee-AIIS/
    Entrepreneur/
    Partner-of-Gift/
    Son-of-Parents/
    Self/
  02-Projects/
  03-Business/
  04-Ideas/
  05-Resources/
  06-Decisions/
  99-Archive/
  raw/
  index.md
  log.md
  LIBRARY_RULES.md
```

Important organization rules:
- Roles = บอส’s life hats/contexts.
- Projects = things being built/done.
- Business = money, market, revenue model, customers, strategy.
- Ideas = not-yet-crystallized thoughts.
- Resources = links/files/tools/references.
- Decisions = important choices and rationale.
- Archive = old/paused stuff, not deleted.
- If one note relates to many places, keep one canonical home and cross-link; do not duplicate randomly.

## Metadata Concept
Start simple:
```yaml
role:
type:
project:
status:
summary:
```
Later optional fields:
```yaml
priority:
due_date:
related:
source:
created_at:
updated_at:
confidence:
```

## Karpathy / LLM Wiki Rules to Borrow
Borrow only as backend discipline:
- Raw sources separated from curated/clean pages.
- `index.md` content catalog.
- `log.md` append-only chronological change log.
- `LIBRARY_RULES.md` or schema/purpose/rules file to control librarian behavior.
- Incremental ingest/query/lint workflow.
- Cross-links / wikilinks.
- Source traceability.
- Human curates/directs; Maymint maintains/summarizes/cross-references.

## Repo Investigated Locally
Repo: https://github.com/nashsu/llm_wiki
Local Mac clone path created during prior session:
```text
/Users/meuu/Desktop/llm_wiki
```
Latest commit seen:
```text
4cb17cb Merge pull request #603 from AndrewDongminYoo/agent/fix-ingest-truncation-and-clip-retries
```

This local clone was only for inspection. For cloud/VPS continuation, clone/fork fresh on cloud.

## What the Repo Is
`nashsu/llm_wiki` is a full desktop app implementing Karpathy-style LLM Wiki:
- React + TypeScript + Vite frontend
- Tauri + Rust desktop backend
- Zustand state
- Ingest queue, raw sources, wiki pages, index/log/schema/purpose
- Search / semantic search / graph / lint / review / MCP/API / Chrome extension / Obsidian compatibility

Approx code size from inspection:
- `.ts` ~62,499 lines
- `.tsx` ~21,651 lines
- `.rs` ~30,397 lines
- ~409 readable files

Conclusion: do **not** rewrite from zero immediately. Use this repo as possible technical base/fork and adapt.

## Key Files Identified for Modification
1. `src/lib/templates.ts`
   - Contains project templates: Research, Reading, Personal Growth, Business, General.
   - Add a new `Boss Library` template with Boss Library schema/purpose/rules and extra dirs.

2. `src/components/project/create-project-dialog.tsx`
   - Project creation dialog selects templates and writes `schema.md`/`purpose.md`.
   - Useful for adding Boss Library template selection.

3. `src-tauri/src/commands/project.rs`
   - Rust create_project currently creates default wiki dirs:
     `raw/sources`, `raw/assets`, `wiki/entities`, `wiki/concepts`, `wiki/sources`, `wiki/queries`, `wiki/comparisons`, `wiki/synthesis`.
   - May need deeper modification later for Boss Library project type, but start without touching Rust if possible.

4. `src/lib/ingest.ts`
   - Core ingest pipeline.
   - Important functions:
     - `buildAnalysisPrompt()` currently asks for Key Entities/Concepts/Main Arguments/etc.
     - `buildGenerationPrompt()` currently generates source/entity/concept/schema-defined wiki files.
   - Must adapt prompts to classify by Boss Library fields: role/type/project/business/status/related/source/summary.

5. `src/lib/wiki-page-types.ts`
   - Current known types: source, entity, concept, comparison, query, synthesis, thesis, methodology, finding.
   - Add/handle Boss Library types such as inbox, role, project, business, idea, decision, resource, task, personal-note, relationship-note, family-note, summary.

6. `src/components/layout/knowledge-tree.tsx`
   - Left sidebar groups pages by type.
   - Currently displays Overview, Entities, Concepts, Sources, Synthesis, Findings, Theses, Methodologies, Comparisons, Queries.
   - For Boss Library, should eventually show Inbox, Roles, Projects, Business, Ideas, Resources, Decisions, Archive.

7. `src/i18n/en.json`, `src/i18n/zh.json`
   - Branding and labels like LLM Wiki, Wiki, Sources, Research, etc.
   - Change/copy to Boss Library wording later.

8. `src/components/layout/icon-sidebar.tsx`
   - Navigation/sidebar icons and labels; logo alt currently LLM Wiki.

## Recommended Cloud Continuation Plan
1. On cloud/VPS, clone or fork:
```bash
git clone https://github.com/nashsu/llm_wiki.git
cd llm_wiki
```

2. Run baseline install/build first before modifying:
```bash
npm ci
npm run typecheck
npm run build
```
Possibly also:
```bash
npm --prefix mcp-server ci
npm run mcp:build
```

3. Start with a small proof-of-concept branch:
```bash
git checkout -b boss-library-template-poc
```

4. Phase 1 code changes:
- Add Boss Library template in `src/lib/templates.ts`.
- Add initial Boss Library page types/routing via schema table.
- Do not rewrite whole UI yet.
- Test that creating a project writes correct `schema.md`, `purpose.md`, and folders.

5. Phase 2 code changes:
- Adapt `buildAnalysisPrompt()` / `buildGenerationPrompt()` in `src/lib/ingest.ts` to follow Boss Library rules when schema/purpose indicates Boss Library.
- Keep existing LLM Wiki behavior for other templates if possible.

6. Phase 3 code changes:
- Add Boss Library type labels/icons and sidebar grouping.
- Update i18n/branding lightly.

7. After every meaningful code change, run:
```bash
npm run typecheck
npm run test:mocks
```

## Important Product Boundary
Do not let the work drift into “generic LLM Wiki.” Keep repeating:
- Front concept: Boss Library.
- Backend discipline: Karpathy anti-chaos rules.
- Technical base: nashsu/llm_wiki if suitable.
- Maymint role: librarian who organizes, writes, connects, and retrieves for บอส.

## Current User Concern
บอส realized the earlier inspection was on Mac local, but wants the work/session to continue on cloud. The next assistant should help transfer context, not panic. The local clone can be ignored or used as reference; cloud should clone fresh unless there are local patches to move.