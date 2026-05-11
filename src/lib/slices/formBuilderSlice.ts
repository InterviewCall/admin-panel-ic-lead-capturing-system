import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FormQuestion } from '@/types/formBuilder';
import { FormBuilderState } from '@/types/state';

const initialState: FormBuilderState = {
    createdFormId: null,
    createdFormSlug: null,
    questions: []
};

const formBuilderSlice = createSlice({
    name: 'formBuilder',
    initialState,
    reducers: {
        setCreatedForm: (state, action: PayloadAction<{ formId: number, slug: string }>) => {
            state.createdFormId = action.payload.formId;
            state.createdFormSlug = action.payload.slug;
        },

        addQuestionToBuilder: (state, action: PayloadAction<FormQuestion>) => {
            state.questions.push(action.payload);
        },

        removeQuestionFormBuilder: (state, action: PayloadAction<string>) => {
            state.questions = state.questions.filter((question) => question.id != action.payload);
        },

        clearCreatedForm: (state) => {
            state.createdFormId = null;
            state.createdFormSlug = null;
            state.questions = [];
        },
    }
});

export const { setCreatedForm, clearCreatedForm, addQuestionToBuilder, removeQuestionFormBuilder } = formBuilderSlice.actions;

export default formBuilderSlice.reducer;