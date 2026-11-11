// Personal mod: delete the worktree of the focused terminal with `hwt -d`.
// It finds the worktree and its branch first, then asks for confirmation.
// Enter confirms, Esc cancels. When git refuses because the worktree has
// changes, the dialog offers "Delete anyway" (`hwt -d <branch> --force`).
import { View, div } from "gpui-kit";
import { v_flex, h_flex } from "gpui-base";
import { exec, focused, props, closeOverlay, notify, theme } from "herdr";

const TIMEOUT_MS = 120000;

async function git(cwd, args) {
  const r = await exec("git", args, { cwd, timeout: 10000 });
  if (r.code !== 0) throw new Error((r.stderr || r.stdout).trim() || `git ${args.join(" ")} failed`);
  return r.stdout.trim();
}

// The linked worktree that holds `cwd`: { branch, path, name }.
async function worktreeOf(cwd) {
  if (!cwd) throw new Error("No focused terminal folder. Focus a terminal in the worktree first.");
  const branch = await git(cwd, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const [path, gitDir, commonDir] = (await git(cwd, ["rev-parse", "--path-format=absolute", "--show-toplevel", "--git-dir", "--git-common-dir"])).split("\n");
  if (gitDir === commonDir) throw new Error(`${path} is the main checkout, not a linked worktree.`);
  if (branch === "HEAD") throw new Error(`${path} has a detached HEAD; hwt -d needs a branch.`);
  return { branch, path, name: path.split("/").pop() };
}

export default class HwtDelete extends View {
  init(_props, cx) {
    this.wt = null;
    this.error = "";
    this.busy = true; // finding the worktree
    this.canForce = false;
    this.handle = cx.focus_handle();
    this.handle.focus();
    const cwd = focused()?.cwd ?? null;
    cx.spawn(async (cx) => {
      try {
        this.wt = await worktreeOf(cwd);
      } catch (e) {
        this.error = String(e.message ?? e);
      }
      this.busy = false;
      cx.notify();
    });
  }

  close() {
    closeOverlay(props().overlay);
  }

  confirm(cx, force) {
    if (this.busy || !this.wt) return;
    const { branch, path } = this.wt;
    this.busy = true;
    this.error = "";
    cx.notify();
    cx.spawn(async (cx) => {
      // stdin from /dev/null: hwt ends with `exec $SHELL`, which then exits at once.
      const args = ["-c", 'hwt -d "$1" $2 </dev/null', "hwt", branch, ...(force ? ["--force"] : [])];
      let r;
      try {
        r = await exec("/bin/zsh", args, { cwd: path, timeout: TIMEOUT_MS });
      } catch (e) {
        r = { code: -1, stdout: "", stderr: String(e) };
      }
      this.busy = false;
      if (r.code === 0) {
        this.close();
        notify({ title: `Deleted worktree ${branch}`, body: path, level: "success" });
        return;
      }
      this.error = (r.stderr || r.stdout || `hwt -d failed (exit ${r.code})`).trim();
      this.canForce = !force && /--force|modified or untracked/.test(this.error);
      cx.notify();
    });
  }

  render() {
    const t = theme();
    const wt = this.wt;
    const button = (id, label, primary, onClick) => h_flex().id(id).h(32).px(14).items_center().rounded(8)
      .border_1().border_color(primary ? t.ansi1 : t.input).bg(primary ? t.ansi1 : t.raised)
      .text_color(primary ? "#ffffff" : t.foreground).text_size(12.5).font_medium().cursor_pointer()
      .when(this.busy, (el) => el.opacity(0.5))
      .hover((s) => s.opacity(0.88)).on_click(onClick).child(label);
    const line = (text, color = t.muted) => div().text_size(12.5).text_color(color).child(text);
    const title = wt ? `Delete worktree "${wt.name}"?` : this.busy ? "Finding the worktree…" : "Cannot delete a worktree";
    return v_flex().id("hwt-delete").track_focus(this.handle)
      .on_key_down((e, cx) => {
        if (e.key === "enter") this.confirm(cx, this.canForce);
        else if (e.key === "escape") { if (!this.busy) this.close(); }
        else return;
        cx.stop_propagation();
      })
      .w_full().min_h(0).p(18).gap(10).bg(t.popover).text_color(t.foreground)
      .child(h_flex().items_center()
        .child(div().flex_1().text_size(15).font_semibold().child(title))
        .child(div().text_size(11).text_color(t.dim).child("Esc")))
      .when(Boolean(wt), (el) => el
        .child(line(`Folder: ${wt.path}`))
        .child(line(`Branch: ${wt.branch} is force-deleted (git branch -D). Unmerged commits are lost.`))
        .child(line("Its Herdr space closes and its terminals end.")))
      .when(Boolean(this.error), (el) => el.child(div().text_size(11.5).text_color(t.ansi1).child(this.error)))
      .child(h_flex().pt(10).gap(8).justify_end()
        .child(button("hwtd-cancel", "Cancel", false, () => { if (!this.busy) this.close(); }))
        .when(Boolean(wt), (el) => el.child(button("hwtd-yes",
          this.busy ? "Deleting…" : this.canForce ? "Delete anyway (--force)" : "Delete",
          true, (_e, cx) => this.confirm(cx, this.canForce)))));
  }
}
