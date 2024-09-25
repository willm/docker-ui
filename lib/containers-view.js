export const render = (containers) => {
  return `<section id="containers">
  <form hx-post="/containers" hx-target="#containers">
      <input type="text" name="image" id="image" />
      <label for="image">image</label>
      <input type="text" name="cmd" id="cmd" />
      <label for="cmd">command</label>
      <button type="submit">+</button>
  </form>
  <ul>
      ${containers
        .map(
          (c) => `<li>
        ${new Date(c.Created * 1000).toISOString()} ${c.Id.substring(0, 12)} ${c.Command}
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
