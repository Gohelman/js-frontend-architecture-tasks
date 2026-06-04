// BEGIN
export default (companies) => {
  const state = {
    openedCompanyId: null,
  };

  const container = document.querySelector('.container');

  const render = () => {
    container.innerHTML = '';

    companies.forEach((company) => {
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-primary');
      button.textContent = company.name;

      button.addEventListener('click', () => {
        if (state.openedCompanyId === company.id) {
          state.openedCompanyId = null;
        } else {
          state.openedCompanyId = company.id;
        }

        render();
      });

      container.append(button);
    });

    const openedCompany = companies.find((company) => company.id === state.openedCompanyId);

    if (openedCompany) {
      const description = document.createElement('div');
      description.textContent = openedCompany.description;
      container.append(description);
    }
  };

  render();
};
// END