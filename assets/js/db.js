import { openDB } from 'https://unpkg.com/idb@5.0.4/build/esm/index.js?module';

const dbPromise = openDB("Smokestronaut", 1, {
    upgrade(db, oldVersion) {
        switch(oldVersion) {
            case 0: 
            const dailyObjectStore = db.createObjectStore("daily", {
                keyPath: "fullDate"
            });

            const surveyObjectStore = db.createObjectStore("survey", {
                keyPath: "id"
            });

            const hasilObjectStore = db.createObjectStore("hasil", {
                keyPath: "id"
            });
        }
    }
})

function insertDaily(fullDate, tanggal, bulan, tahun, merokok, rokok, biaya, alasan) {
    dbPromise.then(function(db) {
        var tx = db.transaction('daily', 'readwrite');
        var daily = tx.objectStore('daily');
        var item = {
            fullDate: fullDate,
            tanggal: tanggal,
            bulan: bulan,
            tahun: tahun,
            merokok: merokok,
            rokok: rokok,
            biaya: biaya,
            alasan: alasan
        };
        daily.put(item);
        return tx.complete;
    })
}

function getDailyByDate(fullDate) {
    return new Promise( (resolve, reject) => { 
        dbPromise.then(function(db) {
            var tx = db.transaction('daily', 'readonly');
            var daily = tx.objectStore('daily');
            return daily.get(fullDate);
        }).then(function(val) {
            resolve(val);
        })
    })
}

function getDaily() {
    return new Promise( (resolve, reject) => { 
        dbPromise.then(function(db) {
            var tx = db.transaction('daily', 'readonly');
            var daily = tx.objectStore('daily');
            return daily.getAll();
        }).then(function(val) {
            resolve(val);
        })
    })
}

function getDayElapsed() {
    return new Promise( (resolve, reject) => { 
        dbPromise.then(function(db) {
            var tx = db.transaction('daily', 'readonly');
            var daily = tx.objectStore('daily');
            return daily.getAll();
        }).then(function(val) {
            var i = 0;
            val.forEach(function(data) {
                if(data.merokok == 0) {
                    i++;
                }
            })
            resolve(i);
        })
    })
}

function insertSurvey(id, keluarga, biaya, hari, tanya, score) {
    dbPromise.then(function(db) {
        var tx = db.transaction('survey', 'readwrite');
        var survey = tx.objectStore('survey');
        var item = {
            id: "survey",
            keluarga: keluarga,
            biaya: biaya,
            hari: hari,
            tanya: tanya,
            score: score
        };
        survey.put(item);
        return tx.complete;
    })
}

function getSurvey() {
    return new Promise( (resolve, reject) => { 
        dbPromise.then(function(db) {
            var tx = db.transaction('survey', 'readonly');
            var survey = tx.objectStore('survey');
            return survey.get('survey');
        }).then(function(val) {
            resolve(val);
        })
    })
}

function insertHasil(hasil, tips) {
    dbPromise.then(function(db) {
        var tx = db.transaction('hasil', 'readwrite');
        var res = tx.objectStore('hasil');
        var item = {
            id: "hasil",
            hasil: hasil,
            tips: tips
        };
        res.put(item);
        return tx.complete;
    })
}

function getHasil() {
    return new Promise( (resolve, reject) => { 
        dbPromise.then(function(db) {
            var tx = db.transaction('hasil', 'readonly');
            var res = tx.objectStore('hasil');
            return res.get('hasil');
        }).then(function(val) {
            resolve(val);
        })
    })
}

export { insertDaily, getDaily, getDailyByDate, getDayElapsed, insertSurvey, getSurvey, insertHasil, getHasil };