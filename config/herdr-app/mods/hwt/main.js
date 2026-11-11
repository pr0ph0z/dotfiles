// Personal mod: ask for a branch name, then run `hwt <branch>` in the focused
// terminal's folder. hwt makes the worktree and its desktop space.
// Enter runs, Esc cancels. The dialog stays open while hwt runs and shows
// hwt's error output when it fails.
import { View, div } from "gpui-kit";
import { v_flex, h_flex, InputState, Input } from "gpui-base";
import { exec, focused, props, closeOverlay, notify, theme } from "herdr";

// hwt waits for `herdr worktree create`; give it time.
const TIMEOUT_MS = 120000;

export default class Hwt extends View {
  init(_props, cx) {
    this.text = "";
    this.busy = false;
    this.error = "";
    this.cwd = focused()?.cwd ?? null;
    this.input = InputState.new({ placeholder: "feat/my-branch" });
    this.input.on("change", (_e, cx) => { this.text = this.input.value(); this.error = ""; cx.notify(); });
    this.input.on("submit", (_e, cx) => this.submit(cx));
    this.input.focus();
    cx.timer.after(600, () => this.input.focus());
    this.handle = cx.focus_handle();
  }

  close() {
    closeOverlay(props().overlay);
  }

  submit(cx) {
    const branch = this.text.trim();
    if (this.busy) return;
    if (!branch) { this.error = "Type a branch name."; cx.notify(); return; }
    if (/\s/.test(branch) || branch.startsWith("-")) { this.error = "A branch name has no spaces and does not start with '-'."; cx.notify(); return; }
    if (!this.cwd) { this.error = "No focused terminal folder. Focus a terminal in the repository first."; cx.notify(); return; }
    this.busy = true;
    this.error = "";
    cx.notify();
    cx.spawn(async (cx) => {
      let r;
      try {
        r = await exec("hwt", [branch], { cwd: this.cwd, timeout: TIMEOUT_MS });
      } catch (e) {
        r = { code: -1, stdout: "", stderr: String(e) };
      }
      this.busy = false;
      if (r.code === 0) {
        this.close();
        notify({ title: `Worktree ${branch}`, body: r.stdout.trim().split("\n").pop() || "Created", level: "success" });
        return;
      }
      this.error = (r.stderr || r.stdout || `hwt failed (exit ${r.code})`).trim();
      cx.notify();
    });
  }

  key(e, cx) {
    if (e.key === "escape" && !this.busy) { this.close(); cx.stop_propagation(); }
  }

  render() {
    const t = theme();
    const label = (text) => div().pt(16).pb(7).text_size(11.5).text_color(t.dim).child(text);
    const button = (id, text, primary, action) => h_flex().id(id).h(32).px(14).items_center().rounded(8)
      .border_1().border_color(primary ? t.solid : t.input).bg(primary ? t.solid : t.raised)
      .text_color(primary ? t.solid_foreground : t.foreground).text_size(12.5).font_medium().cursor_pointer()
      .when(this.busy, (el) => el.opacity(0.5))
      .hover((s) => s.opacity(0.88)).on_click(action).child(text);
    return v_flex().id("hwt").track_focus(this.handle).on_key_down((e, cx) => this.key(e, cx))
      .w_full().min_h(0).p(18).bg(t.popover).text_color(t.foreground)
      .child(h_flex().items_center()
        .child(div().flex_1().text_size(15).font_semibold().child("New worktree"))
        .child(div().text_size(11).text_color(t.dim).child("Esc")))
      .child(label("Branch"))
      .child(Input.new(this.input).h(36).px(10).rounded(9).border_1().border_color(t.accent).bg(t.background).text_size(12.8).text_color(t.foreground))
      .child(div().pt(6).text_size(11.5).text_color(t.dim).child(this.cwd ? `Runs hwt in ${this.cwd}` : "No focused terminal folder"))
      .when(Boolean(this.error), (el) => el.child(div().pt(8).text_size(11.5).text_color(t.ansi1).child(this.error)))
      .child(h_flex().pt(20).gap(8).justify_end()
        .child(button("hwt-cancel", "Cancel", false, () => { if (!this.busy) this.close(); }))
        .child(button("hwt-create", this.busy ? "Creating…" : "Create", true, (_e, cx) => this.submit(cx))));
  }
}
