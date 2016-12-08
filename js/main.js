var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: membersRandom("hero"),
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: membersRandom("monster"),
    }
});

function membersRandom(partyId){

    personajes = Object.keys(RPG.entities.characters); //necesitamos los nombres de los personajes
    myArr = []; //un array vacio
    size = Math.floor(Math.random() * 4) + 1; //y un numero aleatorio (1-4)
    
    var aux = 0;
    while (aux < size){ //seguir hasta completar array

        var ch = personajes[Math.floor(Math.random() * personajes.length)]; //coger un personaje aleatorio del RPG

        if (ch.substr(0, partyId.length) === 'hero'){ //comprobamos si es de la party que queremos
            myArr.push(RPG.entities.characters[ch]);//si lo es lo añadimos a nuestro array
            aux++; //y continuamos
        }

        if (ch.substr(0, partyId.length) === 'monster'){ //comprobamos si es de la party que queremos
            myArr.push(RPG.entities.characters[ch]);//si lo es lo añadimos a nuestro array
            aux++; //y continuamos
        }
    }
    return myArr;
};

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);

    // TODO: render the characters
   
    var listHeroes = this.characters.allFrom("heroes");//aqui tenemos a los personajes de cada bando
    var listMonsters = this.characters.allFrom("monsters");

    var HeroesIds = Object.keys(listHeroes); //necesitamos guardar los ids para el punto 2
    var MonstersIds = Object.keys(listMonsters);

    var Party1 = document.getElementById('heroes'); //accedemos a cada seccion
    var Party2 = document.getElementById('monsters');

    insert (Party1, listHeroes, HeroesIds);
    insert (Party2, listMonsters, MonstersIds);

	//creamos una funcion para no estar todo el rato haciendo lo mismo
    function insert (Party, list, ids) {

		var items = Party.querySelector('[class=character-list]'); //nos vamos al childnodo que queremos
		var aux = 0;
        items.innerHTML = ""; //debemos inicializarlo fuera del bucle

    	for (var i in list){
    		var li = document.createElement('li'); //creamos una lista de tipo <li>
    		var ch = list[i];

            if (ch.hp <= 0) li.classList.add('dead'); //si está muerto lo mostrará tachado

    		li.dataset.charaId = ids[aux]; //guardamos la etiqueta del personaje
			li.innerHTML += ch.name + ' (HP: <strong>' + ch.hp + '</strong>/' 
  				+ ch.maxHp + ', MP: <strong>' + ch.mp + '</strong>/' + ch.maxMp + ')';

  			items.appendChild(li); //^la rellenamos y la añadimos a items (el childnodo que corresponde)
  			aux++;
    	}
    }

    // TODO: highlight current character

    var activeCh = data.activeCharacterId; //data nos da el id del personaje activo
    var highlightCh = document.querySelector ('[data-chara-id= "' + activeCh + '" ]'); //cogemos el personaje de la lista HTML
    highlightCh.classList.add ('active'); //le añadimos la clase active para que el css funcione
    	//para que todo esto funcione necesitamos haber guardado el id del personaje en la lista <li>

    // TODO: show battle actions form

    actionForm.style.display = 'block'; //hacemos visible el formulario de acciones


    ///////////////////ACCIONES\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    var options = this.options.list(); //cogemos la lista de acciones posibles
    var choices = actionForm.querySelector('[class=choices]'); //nos vamos al nodo correspondiente
    choices.innerHTML = "";

    for (var i in options){
    	var li = document.createElement('li');
        li.innerHTML += '<label><input type="radio" name="option" value="' + options[i] +  '" required> ' + options[i] + '</label>';
    	choices.appendChild(li);
    }//lo rellenamos con la lista <li>


    ///////////////////TARGETS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    var targets = this._charactersById; //cogemos la lista de targets posibles
    var choices = targetForm.querySelector('[class=choices]');
    choices.innerHTML = "";

    for (var i in targets){
        if (targets[i]._hp > 0){ //solo lo añadimos en la lista si está vivo
            var li = document.createElement('li');

            if (targets[i].party === "heroes"){
                li.innerHTML += '<heroe><label><input type="radio" name="option" value="' + i +  '" required> ' + i + '</label></heroe>';
            }//las nuevas etiquetas (heroe y monst) dan colores diferentes a los miembros de cada party gracias al css modificado
            else li.innerHTML += '<monst><label><input type="radio" name="option" value="' + i +  '" required> ' + i + '</label></monst>';

            choices.appendChild(li);
        }
    }//lo rellenamos con la lista <li>


    //////////////////////SPELLS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    var spells = this._grimoires[this._activeCharacter.party];//cogemos la lista de hechizos posibles para esta party
    var choices = spellForm.querySelector('[class=choices]'); //nos vamos al nodo correspondiente
    choices.innerHTML = "";
    
    for (var i in spells){
        var li = document.createElement('li');
        li.innerHTML += '<label><input type="radio" name="option" value="' + i +  '" required> ' + i + '</label>';
        choices.appendChild(li);
    }//lo rellenamos con la lista <li>
 
    if (choices.innerHTML === "") spellForm.querySelector('[type=submit]').disabled = true; //asi se deshabilita el boton si no hay hechizos disponibles
    else spellForm.querySelector('[type=submit]').disabled = false; //asi se deja normal

});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
    
    infoPanel.innerHTML = '<strong>' + data.activeCharacterId + '</strong> '; //wizz

    if (data.action === "defend"){
        infoPanel.innerHTML += 'defense ';

        if (data.success) infoPanel.innerHTML += 'improved to ' + data.newDefense + '.';
        else infoPanel.innerHTML += 'was unsuccessful.'
    }
    else {

        infoPanel.innerHTML += data.action + 'ed'; //cast-ed

        if (data.action === "cast") infoPanel.innerHTML += '<i> ' + data.scrollName + '</i> on'; //fireball on

        infoPanel.innerHTML += '<strong> ' + data.targetId + '</strong>'; //skeleton

        if (data.success){
            var effectsTxt = prettifyEffect(data.effect || {}); //'causing ' + damage
            infoPanel.innerHTML += ' causing ' + effectsTxt + '.';
        }
        else infoPanel.innerHTML += ' but was unsuccessful.';
    }
    
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    var listHeroes = this.characters.allFrom("heroes");//aqui tenemos a los personajes de cada bando
    var listMonsters = this.characters.allFrom("monsters");

    var HeroesIds = Object.keys(listHeroes); //vamos a guardar las etiquetas otra vez
    var MonstersIds = Object.keys(listMonsters);

    var Party1 = document.getElementById('heroes'); //accedemos a cada seccion
    var Party2 = document.getElementById('monsters');

    insert (Party1, listHeroes, HeroesIds);
    insert (Party2, listMonsters, MonstersIds);

    //creamos una funcion para no estar todo el rato haciendo lo mismo
    function insert (Party, list, ids) {

        var items = Party.querySelector('[class=character-list]'); //nos vamos al childnode que queremos
        var aux = 0;
        items.innerHTML = "";

        for (var i in list){
            var li = document.createElement('li'); //creamos una lista de tipo <li>
            var ch = list[i];

            if (ch.hp <= 0) li.classList.add('dead'); //si está muerto lo mostrará tachado

            li.dataset.charaId = ids[aux]; //guardamos la etiqueta del personaje
            li.innerHTML += ch.name + ' (HP: <strong>' + ch.hp + '</strong>/' 
                + ch.maxHp + ', MP: <strong>' + ch.mp + '</strong>/' + ch.maxMp + ')';

            items.appendChild(li); //^la rellenamos y la añadimos a items (el childnodo que corresponde)
            aux++;
        }
    }

    // TODO: display 'end of battle' message, showing who won
    infoPanel.innerHTML = 'Battle is over! Winners were: <strong>' + data.winner + '</strong>';

    //opcional: un boton para emepezar otra partida
    infoPanel.innerHTML += '<form name="reset"><p><button type="submit">Play again</button></p>';

});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the action chosen by the player
        var action = actionForm.elements['option'].value;
        battle.options.select(action);

        // TODO: hide this menu
        actionForm.style.display = 'none';

        // TODO: go to either select target menu, or to the select spell menu
        if (action === 'attack') //se va a target
            targetForm.style.display = 'block';
        else if (action === 'cast')//o al menu de hechizos
            spellForm.style.display = 'block';
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        var target = targetForm.elements['option'].value;
        battle.options.select(target);

        // TODO: hide this menu
        targetForm.style.display = 'none';
    });

    targetForm.querySelector('.cancel').addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();

        targetForm.style.display = 'none'; //hide the menu and go back to the action menu
        actionForm.style.display = 'block';
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        var spell = spellForm.elements['option'].value;
        battle.options.select(spell);

        // TODO: hide this menu
        spellForm.style.display = 'none';

        // TODO: go to select target menu
        targetForm.style.display = 'block';
    });

    spellForm.querySelector('.cancel').addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        battle.options.cancel();

        // TODO: hide this form
        spellForm.style.display = 'none';

        // TODO: go to select action menu
        actionForm.style.display = 'block';
    });

    battle.start();
};