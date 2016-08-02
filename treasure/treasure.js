// Script for dividing treasure among PCs
// Setup: Make sure pp, gp, ep, sp, and cp are set to a value for all characters.

var addAttr = function (attr, add) {
  var old = parseInt(attr.get('current'));
  if (attr.get('current') === '') {
    attr.set('current', add)
  } else {
    attr.set('current', old + add);
  }
}

var divideTreasure = function(denomination, amount) {
  if (amount % 1 === 0 && amount >= 0) {
    var attrs = attributes(denomination);
    var add = Math.floor(amount / attrs.length);

    // Randomly assign the remainder to a single character.
    var rem = amount % attrs.length;
    var remPC = randomInteger(attrs.length);
    addAttr(attrs[remPC-1], rem);

    _.each(attrs, function (attr) {
      addAttr(attr, add);
    });
    sendChat("Treasure", "The party earned " + amount + " " + denomination + "!")
  } else {
    sendChat("Treasure", "/w gm Amount must be a natural number")
  }
};

// Returns an array of attribute objects
// Assumes that any character with the given attribute is a PC
var attributes = function(attr) {
  return filterObjs((o) => {
    return (o.get('type')==='attribute' && o.get('name')===attr);
  });
};

on("chat:message", function(msg) {
  if (msg.type == "api" && playerIsGM(msg.playerid)) {
    args = msg.content.split(/\s+/);
    switch (args[0]) {
      case '!pp': divideTreasure('pp', args[1]); break;
      case '!gp': divideTreasure('gp', args[1]); break;
      case '!ep': divideTreasure('ep', args[1]); break;
      case '!sp': divideTreasure('sp', args[1]); break;
      case '!cp': divideTreasure('cp', args[1]); break;
      default: ;
    }
  }
});

