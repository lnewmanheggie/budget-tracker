let db;
let objStore;

const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = function (e) {
    db = e.target.result;

    objStore = db.createObjectStore("pending", {autoIncrement: true});
}

request.onsuccess = function (event) {
    db = event.target.result;
  
    if (navigator.onLine) {
      checkDatabase();
    }
  };
  
  request.onerror = function (event) {
    console.log("Something went wrong");
  };

  function checkDatabase() {
    db = request.result;
    const transaction = db.transaction(["pending"], "readwrite");
    objStore = transaction.objectStore("pending");

    const getAll = objStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
          fetch('/api/transaction/bulk', {
            method: 'POST',
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json',
            },
          })
            .then((response) => response.json())
            .then(() => {
              // if successful, open a transaction on your pending db
              // access your pending object store
              // clear all items in your store
              const transaction = db.transaction(["pending"], "readwrite");
              objStore = transaction.objectStore("pending");
              objStore.clear();
            });
        }
      };
  }

  function saveRecord(record) {
    db = request.result;
    const transaction = db.transaction(["pending"], "readwrite");
    objStore = transaction.objectStore("pending");
    // const statusIndex = objStore.index("ID");
  
    objStore.add(record);
  }

  // listen for app coming back online
window.addEventListener('online', checkDatabase);