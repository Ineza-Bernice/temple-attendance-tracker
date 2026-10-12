<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use TanStack file routes for the ministry workspace; each view has a dedicated content route and unique metadata to preserve native navigation.
- Keep attendance entities, frontend state, and reusable views in src/features/attendance; shared state lives above route content so registration and check-ins remain available during navigation.
- This frontend uses explicitly marked fictional demonstration data in memory only; do not claim permanent or shared storage until an authenticated Cloud service is implemented.
- All visual values belong to semantic tokens and shared styles in src/styles.css so the workspace theme remains consistent.
