import { TextComponentProps } from "@/defaultProps";
import { testComponents } from "@/store/editor";
import store from "@/store/index";
import { cloneDeep, last } from "lodash-es";
const clomeCmps = cloneDeep(testComponents);
describe("test editor module", () => {
  it("should have default components", () => {
    expect(store.state.editor.components).toHaveLength(clomeCmps.length);
  });
  it("should", () => {
    store.commit("setActive", clomeCmps[0].id);
    expect(store.state.editor.currentElement).toBe(clomeCmps[0].id);
    const currentElement = store.getters.getCurrentElement;
    expect(currentElement.id).toBe(clomeCmps[0].id);
  });
  it("add cmp", () => {
    const payload: Partial<TextComponentProps> = {
      text: "text1",
    };
    store.commit("addComponent", payload);
    expect(store.state.editor.components).toHaveLength(clomeCmps.length + 1);
    const lastItem = last(store.state.editor.components);
    expect(lastItem?.props.text).toBe("text1");
  });
  it("update cmp works fire", () => {
    const newProps = {
      key: "text",
      value: "update",
    };
    store.commit("updateComponent", newProps);
    const currentElement = store.getters.getCurrentElement;
    expect(currentElement.props.text).toBe("update");
  });
});
