class DeltagerManager {
    // Deklarer felt-variabler her
  
    
    constructor(root) {
        // Legg inn kode her
       this.root = root;
       this.deltagere = [];
       this.deltagerMap = new Map();
       
       // Knytter input-feltene til implisitt deklarerte variabler
       this.startnummerInput = this.root.querySelector("#startnummer");
       this.deltagerNavnInput = this.root.querySelector("#deltagernavn");
       this.sluttidInput = this.root.querySelector("#sluttid");
       
       // Knytter knappene til implisitt deklarerte variabler og kobler dem til hendelser
       const registrerButton = this.root.querySelector(".registrering button");
       registrerButton.addEventListener("click", () => this.registrerDeltager());
       
       // Knytter output-feltet sine <span> til implisitt deklarerte variabler
       this.deltagerSpan = this.root.querySelector(".hidden span");
       
       
        
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
             this.deltagere.push(deltager);
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
             console.log(sluttid);
             console.log(sekunder);
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
   

    // Deklarer klassen sine public og private metoder her
   
}

const rootelement = document.getElementById("root");
new DeltagerManager(rootelement);
