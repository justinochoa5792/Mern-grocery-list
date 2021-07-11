import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "http://localhost:3001";

function App() {
  const [grocery, setGrocery] = useState([]);
  const [popupActive, setpopupActive] = useState(false);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    GetGroceryList();
  }, []);

  const GetGroceryList = async () => {
    await fetch(API_BASE + "/grocery")
      .then((res) => res.json())
      .then((data) => setGrocery(data));
  };

  const completeItem = async (id) => {
    const data = await fetch(API_BASE + "/grocery/complete/" + id).then((res) =>
      res.json()
    );
    setGrocery((grocery) =>
      grocery.map((groc) => {
        if (groc._id === data._id) {
          groc.complete = data.complete;
        }
        return groc;
      })
    );
  };

  const deleteItem = async (id) => {
    const data = await fetch(API_BASE + "/grocery/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());
    setGrocery((grocery) => grocery.filter((groc) => groc._id !== data._id));
  };

  const addItemToList = async () => {
    const data = await fetch(API_BASE + "/grocery/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newItem,
      }),
    }).then((res) => res.json());

    setNewItem([...grocery, data]);

    setpopupActive(false);
    setNewItem("");
  };

  return (
    <div className="App">
      <h1>Welcome Justin!</h1>
      <h4>Your Grocery List</h4>

      <div className="grocery-list">
        {grocery.map((groc) => {
          console.log(groc);
          return (
            <div
              className={"grocery-item" + (groc.complete ? " is-complete" : "")}
              key={groc._id}
              onClick={() => completeItem(groc._id)}
            >
              <div className="checkbox"></div>
              <div className="text">{groc.text}</div>
              <div className="delete-item" onClick={() => deleteItem(groc._id)}>
                X
              </div>
            </div>
          );
        })}
      </div>
      <div className="addPopup" onClick={() => setpopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setpopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Item</h3>
            <input
              type="text"
              className="add-item-input"
              onChange={(e) => setNewItem(e.target.value)}
            />
            <div className="button" onClick={addItemToList}>
              Add Item to List
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
