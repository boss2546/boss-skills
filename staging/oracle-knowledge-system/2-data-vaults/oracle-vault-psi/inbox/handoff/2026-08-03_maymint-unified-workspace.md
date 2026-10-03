# Handoff: Maymint unified workspace — 2026-08-03

## Goal
Make Maymint a usable single-page, voice-first workspace that keeps prior chat, context, safety/review, sandbox-action, system-status, and voice controls together rather than discarding layers into separate tabs/screens.

## Decision locked by Boss
- Keep the current unified one-page workspace direction shown in the latest screenshot.
- Voice is the primary interaction, but the other layers remain available on the same screen.
- Do not revert to the old four-tab / multi-page product surface.

## Done today
- Replaced the actual runtime UI in `web/maymint_ui.html` (not only a mockup) with a desktop single-page workspace.
- Visible panels: Voice Core, central `เล่าเล่นกับมาย` chat, Context / งานตอนนี้, Review / Safety, and System.
- Preserved existing controls/endpoints: browser speech recognition, browser TTS, real 3-second microphone flow with consent, dry-run voice turn, emergency stop, `/api/chat`, `/api/review`, `/api/action`, `/api/history`, `/api/clear`, and `/health`.
- Added a TDD contract test for `voicePanel`, `chatPanel`, `contextPanel`, `safetyPanel`, `systemPanel`, required controls, and no old `Voice / Chat / System / Flows` tab string.
- Verified red first, then green. Full test suite passed: `136 passed in 4.11s`.
- Browser smoke: served page, sent dry-run chat successfully, all five panels present, browser console has 0 errors. Latest screenshot confirms the unified layout visually.

## Current state / caveats
- UI: `/Users/meuu/Desktop/โปรเจ็ค hermes/maymint-voice-foundation/web/maymint_ui.html`
- Test: `/Users/meuu/Desktop/โปรเจ็ค hermes/maymint-voice-foundation/tests/test_ui_server_contract.py`
- The latest screenshot confirms a readable unified desktop layout; it is a long workspace by design. No material clipping observed.
- Screenshot says `brain: dry-run` because that server runs with `--dry-run-brain`; this is not yet the finished real-time voice loop.
- Existing Maymint UI servers already listen at `127.0.0.1:8787` (PID 20535) and `127.0.0.1:18766` (PID 37652). Do not launch another server on either port; a duplicate launch failed only because the address was already in use.

## Next session: first action
1. Keep the locked UI composition and begin the next voice gate: wire/verify a real end-to-end push-to-talk turn (mic → STT → Hermes → TTS) with truthful per-state UI and reliable stop/cancel.
2. Before changing UI/runtime, inspect server mode and current processes/ports. Do not silently alter Hermes provider/model configuration.
3. Test Boss’s real microphone only when Boss chooses; risky actions remain repeat-back + explicit confirmation.

## Full project records
- **Primary deep record (read first):** 1,376 lines; source-audited chronology from Foundation P1 through Gates 1–14, runtime/UI architecture, concrete smoke evidence, safety invariants, lessons, deferred scope, and complete evidence index:
  `/Users/meuu/Desktop/โปรเจ็ค hermes/maymint-voice-foundation/MAYMINT_COMPLETE_HISTORY_EVIDENCE_AND_LEARNINGS_2026-08-03.md`
- **Earlier concise companion record (preserved, not overwritten):**
  `/Users/meuu/Desktop/โปรเจ็ค hermes/maymint-voice-foundation/MAYMINT_PROJECT_RECORD_AND_LEARNINGS_2026-08-03.md`

## Commands
```bash
cd '/Users/meuu/Desktop/โปรเจ็ค hermes/maymint-voice-foundation'
python3 -m pytest -q
open http://127.0.0.1:8787/
```
