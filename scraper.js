const { JSDOM } = require("jsdom");
const axios = require('axios');
const BASE_URL = 'https://foot86.fff.fr/competitions/';

const fs = require('fs');
var dataArray = [];
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
        const dom = new JSDOM(data)
        const id = dom.window.document.querySelector("#select-ch");
        const champOptions = [...id.querySelectorAll('option')];


        champOptions.splice(0, 1);

        for (const option of champOptions) {
            let championat = {
                name: option.innerHTML,
                id: option.value,
                phase: await getPhase(option.value)
            }
            dataArray.push(championat);
            console.log(dataArray);
            await new Promise(r => setTimeout(r, 2000));
        }




    } catch (error) {


    }

}

const getPhase = async (idOption) => {



    try {
        console.log("in getPhase")
        var phaseArray = [];
        const { data } = await axios.get(`${BASE_URL}/?id=${idOption}&type=ch&tab=ranking`);
        const dom = new JSDOM(data);

        const id = dom.window.document.querySelector('#phase-competition');
        const phaseOption = [...id.querySelectorAll('option')];


        for (const option of phaseOption) {
            let phase = {
                "name": option.innerHTML,
                "url": option.value.replace("resultat", "ranking"),
                "poule": await getPoule(option.value.replace("resultat", "ranking"))

            }
            console.log(phase);
            phaseArray.push(phase);
        }
        return phaseArray;
    }
    catch (error) {
  
    }

}

const getPoule = async (url) => {

    console.log("inPOule")
    try {

        const { data } = await axios.get(`${BASE_URL}${url}`);
        const dom = new JSDOM(data);
        const id = dom.window.document.querySelector('#poule-competition');
        const pouleOption = [...id.querySelectorAll('option')];

        let pouleArray = [];
        for (const option of pouleOption) {
            let poule = {
                "name": option.innerHTML,
                "url": option.value.replace("resultat", "ranking"),
                "team": await getTeams(option.value.replace("resultat", "ranking"))
            }
            pouleArray.push(poule);
        }


        return pouleArray;

    } catch (err) {
    
    }

}



const getTeams = async (url) => {

    try {
        console.log("in getTeam")

        let clubs = [];
        const { data } = await axios.get(`${BASE_URL}${url}`);

        const dom = new JSDOM(data);
        const clubCells = [...dom.window.document.querySelectorAll('table.ranking-tab tr')];
        clubCells.splice(0, 1);
        for (const cell of clubCells) {
            let clubObject = {};
            let td = cell.querySelectorAll('td');
            let textContentTd = [];
            for (const cell of td) {
                textContentTd.push(cell.textContent.trim())
            }

            for (let i = 0; i < cell.childElementCount; i++) {
                clubObject[objKeys[i]] = textContentTd[i];

            }
            clubs.push(clubObject);

        }

        return clubs

    } catch (error) {
    
        throw error;
    }

}



const uwu = async () => {


    try {
        await getChampionant();
        writeData();

    } catch (error) {
        throw error;
    }

};

uwu();