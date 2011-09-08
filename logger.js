
/**
	* Klasa logująca. Możliwe 3 poziomy logowania:
	* INFO - informujacy
	* WARNING - ostrzeżenia
	* ERROR - błędy
	* DEBUG - debug mode
	* [] - Brak ustawionego poziomu logowania loguje wszystko.
	*
	*	Poziomy mogą być łączone np: [DEBUG, ERROR]
	*
	* Autor: Karol Domagała
	*
*/

var Log = {

	INFO : 		1,
	DEBUG : 	2,
	WARNING : 3,
	ERROR : 	4,

	severity : [1,4],	// domyślnie włączone poziomy INFO i ERROR


	info : function(msg) {
		if (Log.severity.length == 0 || (Log.severity && Log.severity.indexOf(Log.INFO)>=0) )
			console.log(new Date().toLocaleTimeString() + ": [INFO] " + msg);
	},

	warning : function(msg) {
		if (Log.severity.length == 0 || (Log.severity && Log.severity.indexOf(Log.WARNING)>=0))
			console.log(new Date().toLocaleTimeString() + ": [WARNING] " + msg);
	},

	error : function(msg) {
	if (Log.severity.length == 0 || (Log.severity && Log.severity.indexOf(Log.ERROR)>=0))
			console.log(new Date().toLocaleTimeString() + ": [ERROR] " + msg);
	},

	debug : function(msg) {
		if (Log.severity.length == 0 || (Log.severity && Log.severity.indexOf(Log.DEBUG)>=0))
			console.log(new Date().toLocaleTimeString() + ": [DEBUG] " + msg);
	}
	
}

exports.Log = Log;
