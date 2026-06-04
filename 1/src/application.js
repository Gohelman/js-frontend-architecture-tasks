// BEGIN
export default () => {
  const state = {
    sum: 0,
  };

  const form = document.querySelector('form');
  const input = document.querySelector('input[name="number"]');
  const resetButton = document.querySelector('button[type="button"]');
  const result = document.getElementById('result');

  const render = () => {
    result.textContent = state.sum;
    form.reset();
    input.focus();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const value = parseInt(input.value, 10);
    state.sum += value;

    render();
  });

  resetButton.addEventListener('click', () => {
    state.sum = 0;

    render();
  });

  render();
};
// END