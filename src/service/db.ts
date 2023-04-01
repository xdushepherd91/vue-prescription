
const DB_NAME = 'prescription'
const DB_VERSION = 6
let DB
export default {
    async getDb() {
        return new Promise((resolve, reject) => {
            if (DB) { return resolve(DB); }
            let request = window.indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = e => {
                console.log('Error opening db', e);
                reject('Error');
            };

            request.onsuccess = e => {
                DB = e.target.result;
                if(!DB.objectStoreNames.contains('prescription')) {
                    DB.createObjectStore('prescription', { keyPath: "id", autoIncrement: true })
                }
                if(!DB.objectStoreNames.contains('treatment')) {
                    DB.createObjectStore('treatment', { keyPath: "id", autoIncrement: true })
                }
                resolve(DB);
            };

            request.onupgradeneeded = e => {
                let db = e.target.result;
                if(!db.objectStoreNames.contains('prescription')) {
                    db.createObjectStore('prescription', { keyPath: "id", autoIncrement: true })
                }
                if(!db.objectStoreNames.contains('treatment')) {
                    db.createObjectStore('treatment', { keyPath: "id", autoIncrement: true })
                }
            };
        });
    },
    async addData(tableName, data) {
        let db = await this.getDb()
        return new Promise((resolve, reject) => {
            let trans = db.transaction([tableName], 'readwrite');


            let store = trans.objectStore(tableName);
            let request = store.add(data);
            request.onsuccess = event => {
                resolve( event.target.result);
            };       
            request.onerror = err => {
                reject(err)
            }     

        });
    },
    async deleteData(tableName, id) {
        let db = await this.getDb()
        return new Promise((resolve, reject) => {

            let trans = db.transaction([tableName], 'readwrite');
            trans.oncomplete = e => {
                resolve();
            };

            let store = trans.objectStore(tableName);
            store.delete(id);
        });
    },

    async getData(tableName) {

        let db = await this.getDb();

        return new Promise(resolve => {

            let trans = db.transaction([tableName], 'readonly');
            trans.oncomplete = () => {
                resolve(result);
            };

            let store = trans.objectStore(tableName);
            let result = [];

            store.openCursor().onsuccess = e => {
                let cursor = e.target.result;
                if (cursor) {
                    result.push(cursor.value)
                    cursor.continue();
                }
            };

        });
    },


    async updateData(tableName, data) {
        let db = await this.getDb()
        return new Promise((resolve, reject) => {
            let trans = db.transaction([tableName], 'readwrite');


            let store = trans.objectStore(tableName);
            let request = store.put(data);
            request.onsuccess = event => {
                resolve( event.target.result);
            };

        });
    },

    async getById(tableName, id) {

        let db = await this.getDb();

        return new Promise(resolve => {

            let trans = db.transaction([tableName], 'readonly');
            let store = trans.objectStore(tableName);
            let getRequest = store.get(id);

            getRequest.onsuccess = e => {
                resolve(e.target.result)
            };

            getRequest.onerror = e=> {
                console.error(e)
            }

        });
    }

}