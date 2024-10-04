class DeltagerManager {
   
    
    constructor(root) {
        // Legg inn kode her
       this.root = root;
       this.deltagere = [];
       this.deltagerMap = new Map();
       
       // Knytter input-feltene til implisitt deklarerte variabler
       this.startnummerInput = this.root.querySelector("#startnummer");
       this.deltagerNavnInput = this.root.querySelector("#deltagernavn");
       this.sluttidInput = this.root.querySelector("#sluttid");
       this.nedreGrenseInput = this.root.querySelector("#nedregrense");
       this.ovreGrenseInput = this.root.querySelector("#ovregrense");
       
       // Knytter knappene til implisitt deklarerte variabler og kobler dem til hendelser
       const registrerButton = this.root.querySelector(".registrering button");
       registrerButton.addEventListener("click", () => this.registrerDeltager());
       const visButton = this.root.querySelector(".resultat button");
       visButton.addEventListener("click", () => this.visDeltagere());
       
       // Knytter output-feltene til implisitt deklarerte variabler
       this.deltagerSpan = this.root.querySelector(".hidden span");
       this.deltagerVisning = this.root.querySelector(".liste tbody"); 
       this.tomtFelt = this.root.querySelector(".liste p");
       
       
        
    }
    
   
    registrerDeltager(){
        // Henter verdiene fra input-feltene
        const startnummer = this.startnummerInput.value;
        const navn = this.deltagerNavnInput.value;
        const sluttid = this.sluttidInput.value;
        const sekunder = this.tidTilSekunder(sluttid);
        
        // Validerer input-feltene for å se om deltager skal registreres
        const gyldig = this.validerDeltager();
       
        // Viser gyldighetsfeil dersom nødvendig
       if(startnummer === "" || navn === "" || sluttid === ""){
           return;
        } else if(gyldig === false){
            this.sluttidInput.reportValidity();
            this.deltagerNavnInput.reportValidity();
            this.startnummerInput.reportValidity();           
        } else {
            // Oppretter et deltagerobjekt
            const deltager = {
                  startnummer: Number(startnummer),
                  navn: this.formatterNavn(navn),
                  sluttid: sluttid,
                  sekunder: sekunder
        };
                                            
        // Legger deltageren til i samlingen av deltagere
        if (this.deltagere.length != 0) {
            for (let i = 0; i < this.deltagere.length; i++) {
               if (this.deltagere[i].sekunder > deltager.sekunder) {
                  this.deltagere.splice(i, 0, deltager); // Sett inn deltager
                  break; // Avslutt løkken etter at deltageren er lagt til
                } 
             }
             // Hvis deltageren ikke har blitt satt inn i løpet av løkken, legg den til på slutten
             if (!this.deltagere.includes(deltager)) {
                this.deltagere.push(deltager);
             }
        } else {
             // Hvis det ikke er noen deltakere i listen, legg til deltageren direkte
             this.deltagere.push(deltager);
          }

        // Legger deltakeren til i map slik at vi kan holde kontroll på om startnummer er brukt
        this.deltagerMap.set(startnummer, {navn: this.formatterNavn(navn), sluttid: sluttid});  
                                         
        // Tømmer inputfeltene
        this.startnummerInput.value = "";
        this.deltagerNavnInput.value = "";
        this.sluttidInput.value = "";
                                            
        // Skriver ut meldingen med deltagerinfo
        const suksessMelding = this.root.querySelector(".registrering p");
        suksessMelding.classList.remove("hidden");
        suksessMelding.querySelectorAll("span")[0].textContent = deltager.navn;
        suksessMelding.querySelectorAll("span")[1].textContent = deltager.startnummer;
        suksessMelding.querySelectorAll("span")[2].textContent = deltager.sluttid;
             
             
             
             
             
        }

    }
    
    

    visDeltagere(){
        
        const nedreGrense = this.nedreGrenseInput.value; 
        const ovreGrense =  this.ovreGrenseInput.value;
        
        const gyldig = this.validerSok();
        if(gyldig === false){
            this.ovreGrenseInput.reportValidity();
        } else {
            this.tomUtskrift(); // Tømmer utskriftsfeltet dersom man allerede viser et tidligere søk
                   
            if(this.deltagere.length > 0){
              this.tomtFelt.classList.add("hidden");
            }
                   
            if(!nedreGrense && !ovreGrense){
               this.visAlleDeltagere();
            } else if (nedreGrense && !ovreGrense){
                       
                  this.visDeltagereOver();
            } else if(!nedreGrense && ovreGrense){
                  this.visDeltagereUnder();
            } else if(nedreGrense && ovreGrense){
                  this.visDeltagereMellom();
            }
        }
       
    }  
    
    visAlleDeltagere(){
        for(let i = 0; i < this.deltagere.length; i++){
            const rad = document.createElement("tr");
            const plassering = document.createElement("td");
            const startnummer = document.createElement("td");
            const navn = document.createElement("td");
            const sluttid = document.createElement("td");
                       
            this.deltagerVisning.appendChild(rad);
            rad.appendChild(plassering);
            rad.appendChild(startnummer);
            rad.appendChild(navn);
            rad.appendChild(sluttid);
                       
            plassering.textContent = i + 1;
            startnummer.textContent = `${this.deltagere[i].startnummer}`;
            navn.textContent = `${this.deltagere[i].navn}`;
            sluttid.textContent = `${this.deltagere[i].sluttid}`;
                    
        }
    }
    
    visDeltagereMellom(){
        const nedreGrense = this.tidTilSekunder(this.nedreGrenseInput.value);
        const ovreGrense = this.tidTilSekunder(this.ovreGrenseInput.value);

        for(let i = 0; i < this.deltagere.length; i++){
            if(this.deltagere[i].sekunder > nedreGrense && this.deltagere[i].sekunder < ovreGrense){
                const rad = document.createElement("tr");
                const plassering = document.createElement("td");
                const startnummer = document.createElement("td");
                const navn = document.createElement("td");
                const sluttid = document.createElement("td");
                                                      
                this.deltagerVisning.appendChild(rad);
                rad.appendChild(plassering);
                rad.appendChild(startnummer);
                rad.appendChild(navn);
                rad.appendChild(sluttid);
                                                      
                plassering.textContent = i + 1;
                startnummer.textContent = `${this.deltagere[i].startnummer}`;
                navn.textContent = `${this.deltagere[i].navn}`;
                sluttid.textContent = `${this.deltagere[i].sluttid}`;
            }
        }   
    }
    
    visDeltagereOver(){
        const nedreGrense = this.tidTilSekunder(this.nedreGrenseInput.value); 

        for(let i = 0; i < this.deltagere.length; i++){
            if(this.deltagere[i].sekunder > nedreGrense){
                const rad = document.createElement("tr");
                const plassering = document.createElement("td");
                const startnummer = document.createElement("td");
                const navn = document.createElement("td");
                const sluttid = document.createElement("td");
                                       
                this.deltagerVisning.appendChild(rad);
                rad.appendChild(plassering);
                rad.appendChild(startnummer);
                rad.appendChild(navn);
                rad.appendChild(sluttid);
                                       
                plassering.textContent = i + 1;
                startnummer.textContent = `${this.deltagere[i].startnummer}`;
                navn.textContent = `${this.deltagere[i].navn}`;
                sluttid.textContent = `${this.deltagere[i].sluttid}`;
            }
        }
    }
    
    visDeltagereUnder(){
        const ovreGrense = this.tidTilSekunder(this.ovreGrenseInput.value);
        
        for(let i = 0; i < this.deltagere.length; i++){
            if(this.deltagere[i].sekunder < ovreGrense){
                const rad = document.createElement("tr");
                const plassering = document.createElement("td");
                const startnummer = document.createElement("td");
                const navn = document.createElement("td");
                const sluttid = document.createElement("td");
                                                       
                this.deltagerVisning.appendChild(rad);
                rad.appendChild(plassering);
                rad.appendChild(startnummer);
                rad.appendChild(navn);
                rad.appendChild(sluttid);
                                                       
                plassering.textContent = i + 1;
                startnummer.textContent = `${this.deltagere[i].startnummer}`;
                navn.textContent = `${this.deltagere[i].navn}`;
                sluttid.textContent = `${this.deltagere[i].sluttid}`;
            }
        }
    }
    
   tomUtskrift(){
      const utskrift = this.deltagerVisning;
      console.log("tøm utskrift");
      while(utskrift.firstChild){
        utskrift.removeChild(utskrift.lastChild);
      }
   }
    
    formatterNavn(str){
        return str.replace(/(?:^|-|\s)([a-zA-Z])/g, (match, p1, offset) => {
            // Returner bokstaven som stor, og legg til resten av ordet i små bokstaver
            return match.slice(0, match.length - 1) + p1.toUpperCase();
          }).replace(/([a-zA-Z]+)(?=\s|-|$)/g, (match) => {
            // Gjør resten av ordet små bokstaver
            return match.charAt(0).toUpperCase() + match.slice(1).toLowerCase();
          });
    }
    
    tidTilSekunder(tidStreng){
        const [timer, minutter, sekunder] = tidStreng.split(":");
        
        const antallSekunder = ((parseInt(timer) * 3600) + (parseInt(minutter) * 60) + parseInt(sekunder));
        return antallSekunder;
    }
    
    validerDeltager(){
        // Henter verdiene fra input-feltene
        const startnummer = this.startnummerInput.value;
        const navn = this.deltagerNavnInput.value;
        const sluttid = this.sluttidInput.value;
        let valid = true;
                
                
        // Validerer startnummer
        if (this.deltagerMap.has(startnummer)) {
            this.startnummerInput.setCustomValidity("Dette startnummeret er allerede registrert. Velg et annet startnummer!")
            valid = false;
         } else {
            this.startnummerInput.setCustomValidity("");
         }
                
        // Validerer deltagerens navn
        if(/^\s*\p{L}{2,}((\s+|-)\p{L}{2,})*\s*$/u.test(navn) === false){
          this.deltagerNavnInput.setCustomValidity("Tillate tegn er kun bokstaver, mellomrom og enkel bindestrek mellom delnavn")
          valid = false;
        } else {
          this.deltagerNavnInput.setCustomValidity("");
        }
                
       
        
        return valid;
    }
    
    validerSok(){
        const nedreGrense = this.tidTilSekunder(this.nedreGrenseInput.value);
        const ovreGrense = this.tidTilSekunder(this.ovreGrenseInput.value);
        let valid = true;
        
        if(ovreGrense < nedreGrense){
            this.ovreGrenseInput.setCustomValidity("Øvre grense må være større enn nedre");
            valid = false;
        } else {
            this.ovreGrenseInput.setCustomValidity("");
        }
        
        return valid;
    }
   

   
   
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
