// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2608-ANDY"; // Make sure to change this!
const API = BASE + COHORT;

// === State ===
let parties = [];
let selectedParty;
let rsvps = [];
let guests = [];

/** Updates state with all parties from the API */
async function getParties() {
  try {
    //boiler plate fetch
    const response = await fetch(API + "/events");
    //result
    const result = await response.json();
    console.debug(result);
    //array
    parties = result.data;
    console.log(parties);
    //rerender
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single party from the API */
async function getParty(id) {
  try {
    //boilerplate fetch id
    const response = await fetch(API + "/events/" + id);
    //reponse
    const result = await response.json();
    //single element
    selectedParty = result.data;
    //cannot console?
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all RSVPs from the API */
async function getRsvps() {
  try {
    //fetch different endpoint
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    //array
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all guests from the API */
async function getGuests() {
  try {
    //fetch endpoint
    const response = await fetch(API + "/guests");
    const result = await response.json();
    //array
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Party name that shows more details about the party when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");
  //conditional css line
  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }
  //html line
  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  //click event listener
  $li.addEventListener("click", () => getParty(party.id));

  return $li;
}

/** A list of names of all parties */
function PartyList() {
  //parent ul boiler plate
  const $ul = document.createElement("ul");
  //css line
  $ul.classList.add("parties");
  //map line
  const $parties = parties.map(PartyListItem);
  //children line
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }
  //arbitrary section boilerplate
  const $party = document.createElement("section");
  //html
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
  `;
  //render from component?
  $party.querySelector("GuestList").replaceWith(GuestList());

  return $party;
}

/** List of guests attending the selected party */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id,
    ),
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    //html
    $guest.textContent = guest.name;
    return $guest;
  });
  //children
  $ul.replaceChildren(...$guests);

  return $ul;
}

// === Render ===
function render() {
  //selector boilerplate
  const $app = document.querySelector("#app");
  //html
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;
  //replace placeholder with components
  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
}
//init async
async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
