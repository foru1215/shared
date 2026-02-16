
# Auto-Sync Implementation Plan

## File Organization Rule
- **`0190myapp`**: Contains work created on PC `0190`.
- **`shared`** (Root/Others): Contains shared assets or work from other PCs.

## Continuing Conversation
To resume your work on another PC:

1. **Sync**: The `shared` folder syncs automatically at startup.
2. **Context**:
   Tell the AI: "Review `shared/docs/work_history.md`. Note that the project `0190myapp` is located at `shared/0190myapp`."
3. **Paths**:
   - `c:\Users\0190\shared\0190myapp` (Target for 0190 work)

## Files
- `shared/sync-on-startup.ps1`: Syncs the entire `shared` folder.
- `shared/docs/work_history.md`: Project history.
