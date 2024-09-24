export const render = (containers) => {
  return `<ul id="containers">
      ${containers.map(
        (c) => `<li>
        ${c.Id.substring(0, 12)}
        <button hx-target="#containers" hx-delete="/containers/${c.Id.substring(0, 12)}">Delete</button>
      </li>`
      )}
</ul>`;
};
