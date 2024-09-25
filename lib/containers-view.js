export const render = (containers) => {
  return `<section id="containers">
  <form hx-post="/containers" hx-target="#containers">
      <input type="text" name="image" id="image" />
      <label for="image">command</label>
      <input type="text" name="cmd" id="cmd" />
      <label for="cmd">image</label>
      <button type="submit">+</button>
  </form>
  <ul>
      ${containers
        .map(
          (c) => `<li>
        ${c.Id.substring(0, 12)}
        <button
          hx-target="#containers"
          hx-swap="outerHTML"
          hx-delete="/containers/${c.Id.substring(0, 12)}">Delete</button>
      </li>`
        )
        .join("")}
</ul>
    </section>`;
};
