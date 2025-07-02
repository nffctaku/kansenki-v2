export const selectStyles = {
  control: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--select-bg, #fff)',
    borderColor: 'var(--select-border, #d1d5db)',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'var(--select-menu-bg, #fff)',
    zIndex: 20,
  }),
  option: (provided: any, state: { isSelected: any; isFocused: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'var(--select-option-selected-bg, #3b82f6)' : state.isFocused ? 'var(--select-option-focused-bg, #eff6ff)' : 'transparent',
    color: state.isSelected ? 'white' : 'var(--select-option-color, #1f2937)',
    ':active': {
      backgroundColor: 'var(--select-option-active-bg, #dbeafe)',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: 'var(--select-single-value-color, #1f2937)',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'var(--select-input-color, #1f2937)',
  }),
};
