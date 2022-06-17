const { JSDOM } = require("jsdom");
const axios = require('axios');
const base = 'https://foot86.fff.fr/competitions/';

const fs = require('fs');
var dataArray = [];
var championatArray = ["382649", "382650"];
var objKeys = ["ranking", "teamName", "points", "days", "win", "nul", "loose", "forfait", "but_pour", "but_contre", "penality", "diff"];


const writeData = async () => {
    const dataJSON = JSON.stringify(dataArray, null, '\t');
    fs.writeFile('./teams.json', dataJSON, err => {
        if (err) {
            console.log("Error writing to file.");
        } else {
            console.log("Successfully wrote to 'teams.json'.");
        }
    });

}
const getChampionant = async () => {


    try {
        const { data } = await axios.get("https://foot86.fff.fr/competitions/");
        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable"
        })
        const id = dom.window.document.querySelector("#select-ch");
        const champOptions = [...id.querySelectorAll('option')];
        champOptions.splice(0, 1);
        champOptions.forEach((champSelect) => {
            let championat = {
                name: champSelect.innerHTML,
                id: champSelect.value
            }
            championatArray.push(championat);
        })




    } catch (error) {


    }

}



const yolo = async (champ) => {

    try {

        let clubs = [];
        const { data } = await axios.get(`https://foot86.fff.fr/competitions/?id=${champ}&type=ch&tab=ranking`);

        const dom = new JSDOM(data, {
            runScripts: "dangerously",
            resources: "usable"
        });

        const clubCells = [...dom.window.document.querySelectorAll('table.ranking-tab tr')];
        clubCells.splice(0, 1);

            clubCells.forEach( (data) => {
          
            let clubObject = {};
            let td = data.querySelectorAll('td');
            let test = [];
            td.forEach((tdd) => {
                test.push(tdd.textContent.trim());
            })
            for (let i = 0; i < data.childElementCount; i++) {
                clubObject[objKeys[i]] = test[i];
            }
             clubs.push(clubObject);
    
            
        })
    
        let championat = {
            name: champ.name,
            id: champ.id,
            teams: clubs
        }
        dataArray.push(championat);
        //  writeData();

    } catch (error) {
        throw error;
    }

    return;
}



const uwu = async () => {


    try {
        await getChampionant();
        championatArray.forEach(async (champ) => {
            await yolo(champ);
        })
        // for(let i; i<championatArray.length; i++){
        //     console.log(championatArray);
        //     await yolo(championatArray[i.id]);
        // }

        return;
    } catch (error) {
        throw error;
    }

};

uwu();