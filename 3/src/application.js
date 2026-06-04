// BEGIN
export default (laptops) => {
  const state = {
    filters: {
      processor_eq: '',
      memory_eq: '',
      frequency_gte: '',
      frequency_lte: '',
    },
  };

  const form = document.querySelector('form');
  const result = document.querySelector('.result');

  const render = () => {
    const filteredLaptops = laptops.filter((laptop) => {
      const {
        processor_eq,
        memory_eq,
        frequency_gte,
        frequency_lte,
      } = state.filters;

      return (
        (processor_eq === '' || laptop.processor === processor_eq)
        && (memory_eq === '' || laptop.memory === Number(memory_eq))
        && (frequency_gte === '' || laptop.frequency >= Number(frequency_gte))
        && (frequency_lte === '' || laptop.frequency <= Number(frequency_lte))
      );
    });

    result.innerHTML = '';

    if (filteredLaptops.length === 0) {
      return;
    }

    const ul = document.createElement('ul');

    filteredLaptops.forEach((laptop) => {
      const li = document.createElement('li');
      li.textContent = laptop.model;
      ul.append(li);
    });

    result.append(ul);
  };

  const handleChange = (event) => {
    state.filters[event.target.name] = event.target.value;
    render();
  };

  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('input', handleChange);
  });

  const selects = form.querySelectorAll('select');
  selects.forEach((select) => {
    select.addEventListener('change', handleChange);
  });

  render();
};
// END