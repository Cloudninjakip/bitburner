/** @param {NS} ns **/

// was meant to be called single_batch.js but i guess this works too
export async function main(ns) {
	ns.disableLog("ALL");
	var target = ns.args[0];
	var WGScriptSize = 1.8;
	var minSecLvl = ns.getServerMinSecurityLevel(target);
	var maxMoney = ns.getServerMaxMoney(target);
	var targetMoneyPercentage = 0.80;
	var serversSeen = ns.getPurchasedServers(); 
	var securityThresh = minSecLvl;

	ns.print(`MinSecLvl: ${minSecLvl}`);
	ns.print(`CurSecLvl: ${ns.getServerSecurityLevel(target)}`);

	if (ns.getServerMoneyAvailable(target) < (maxMoney * 0.9)) {
		ns.tprintf(`ERROR PRIME SERVER FIRST`);
		ns.print(`PRIME SERVER FIRST`);
		ns.exit();
	} else {
		var hackValue =  maxMoney * targetMoneyPercentage
		var hackThreads = ns.hackAnalyzeThreads(target, Math.floor(hackValue));
	}

	var pservCount = serversSeen.length;
	var availableThreads = Math.floor((ns.getServerMaxRam(serversSeen[0]) - ns.getServerUsedRam(serversSeen[0])) / WGScriptSize);  // threads per server (derived from executed script size)
	// var weakThreads = Math.ceil((ns.getServerSecurityLevel(target) - securityThresh) / 0.05); // Threads required to weaken to reach the security threshold
	var weakThreads = Math.ceil((minSecLvl + 15 - securityThresh) / 0.05);  // Calc how many threads required to weaken from max (NOT OPTIMAL THREAD USAGE (just temporrary))
	var growRatio = 1 / (1 - targetMoneyPercentage); 
	var growThreads = Math.ceil(ns.growthAnalyze(target, growRatio) * 1.5);
	
	var weakTime = ns.getWeakenTime(target);  
	var hackTime = weakTime * 0.25; // 4 hacks per 1 weaken timer
	var growTime = weakTime * 0.8;  // Default bitnode grow rate

	var timeDelay = 100;
	var hackDelay = weakTime - hackTime - timeDelay * 3;
	var weak1Delay = 0;
	var growDelay = weakTime - growTime - timeDelay;
	var weak2Delay = timeDelay * 2;

	var randomArg = Math.random();
	var delay = ns.args[1] * (4 * 25 * timeDelay); // Script count * pserv count * timeDelay
	if (weakThreads > 0) {
		for (let i = 0; i < pservCount; i++) {
			var curServ = serversSeen[i];
			ns.exec("base/weak.js", curServ, weakThreads, target, weak1Delay + delay, randomArg);
			ns.exec("base/weak.js", curServ, weakThreads, target, weak2Delay + delay, randomArg);
			ns.exec("base/hack.js", curServ, hackThreads, target, hackDelay + delay, randomArg);
			ns.exec("base/grow.js", curServ, growThreads, target, growDelay + delay, randomArg);
			delay += timeDelay * 4
		}
	}
}