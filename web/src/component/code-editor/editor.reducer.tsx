export enum EditorActionKind {
    TOGGLE = 'TOGGLE',
}

interface EditorAction {
    type: EditorActionKind;
}

interface EditorState {
    visible: boolean;
}

export function visibleReducer(state: EditorState, action: EditorAction) {
    const { type } = action;
    switch (type) {
        case EditorActionKind.TOGGLE:
            return {
                ...state,
                visible: !state.visible
            };
        default:
            return state;
    }
}
