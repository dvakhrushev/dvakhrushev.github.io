define(function (require, exports, module) {

	var proactiveChatRuleMatcher = {
		"days_of_week":
		{
			days: ["SU", "MO", "TU", "WE", "TH", "FR", "SA" ],
			
			fnCheck: function(args)
			{
				var d = new Date();
				var day = this.days[d.getDay()];
				if(this.values[day])
					return true;
					
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				rtObj.values = {};
				
				for(var i = 0; i < confObj.values.length; ++i)
					rtObj.values[confObj.values[i]] = true;
					
				rtObj.days = this.days;
				
				checker.timerCbMin = true;
				
				return rtObj;
			}
		},
		"days_of_month":
		{
			fnCheck: function(args)
			{
				var d = new Date();
				var day = d.getDate();
				if(this.values[day])
					return true;
					
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				rtObj.values = [];
				
				for(var i = 0; i < confObj.values.length; ++i)
					rtObj.values[parseInt(confObj.values[i])] = true;
					
				checker.timerCbMin = true;
					
				return rtObj;
			}
		},
		"time_of_day":
		{
			fnCheck: function(args)
			{
				var d = new Date();
				var sec = d.getHours() * (60 * 60) + d.getMinutes() * 60 + d.getSeconds();
				if(this.from <= sec && this.to > sec)
					return true;
					
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				rtObj.from = confObj.from;
				rtObj.to = confObj.to;
				
				checker.timerCbSec = true;
				
				return rtObj;
			}
		},
		"months":
		{
			months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ],
			
			fnCheck: function(args)
			{
				var d = new Date();
				var mon = this.month[d.getMonth()];
				if(this.values[mon])
					return true;
					
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				rtObj.values = {};
				
				for(var i = 0; i < confObj.values.length; ++i)
					rtObj.values[confObj.values[i]] = true;
					
				rtObj.month = this.months;
				
				checker.timerCbMin = true;
				
				return rtObj;
			}
		},
		"referring_url": 
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				var re = new RegEx(confObj.value, "i");
				
				if(re.test(document.referrer))
					rtObj.fnCheck = function() { return true; }
				else 
					checker.noCheck = true;
				
				return rtObj;
			}
		},
		"language": 
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				if(navigator.language == confObj.value || navigator.language == confObj.value.substr(0,2))
					rtObj.fnCheck = function() { return true; }
				else 
					checker.noCheck = true;
				
				return rtObj;
			}
		},
		"mobile": 
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				var mobileCheck = require('snippet/mobileCheck');
				if(mobileCheck())
					rtObj.fnCheck = function() { return true; }
				else 
					checker.noCheck = true;

				return rtObj;
			}
		},
		"js_variable":
		{
			fnCheck: function(args)
			{
				if(eval(this.value))
					return true;
					
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				var v = rtObj.value.toString();
				if(/[$a-zA-Z_][$a-zA-Z0-9_]*/.exec(v) == v)
				{
					rtObj.fnCheck = this.fnCheck;
					rtObj.value = "!!" + v;
				}
				else
				{
					checker.noCheck = true;
					return rtObj;
				}
				
				checker.timerCbSec = true;
				
				return rtObj;
			}
		},
		"number_of_clicks":
		{
			fnCheck: function(args)
			{
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				
				var nc = parseInt(confObj.value);
				if(nc < 1)
				{
					checker.noCheck = true;
					return rtObj;
				}
				
				rtObj.clicksLeft = nc;
				
				var cb = 
				{ 
					ev: "click",
					el: document.body,
					fn: function() 
					{ 
						if(--rtObj.clicksLeft <= 0) 
							rtObj.fnCheck = function() { return true; } 
					}
				};	
				
				checker.eventCb.push(cb);
				
				return rtObj;
			}
		},
		"cookie": 
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{

				var name = confObj.value; 
				// var name = confObj.value + "="; 
				var decodedCookie = decodeURIComponent(document.cookie);
				var ca = decodedCookie.split(';');
				
				for(var i = 0; i <ca.length; i++) 
				{
					var c = ca[i];
					while (c.charAt(0) == ' ') {
						c = c.substring(1);
					}
					if (c.indexOf(name) == 0) {
						rtObj.fnCheck = function() { return true; };
						return rtObj;
					}
				}
				
				checker.noCheck = true;
				
				return rtObj;
			}
		},
		"page_url":
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				var uri = document.baseURI;
				var re = new RegExp(confObj.value, "i");
				if(re.test(uri))
				{
					rtObj.fnCheck = function() { return true; };
					return rtObj;
				}
				
				checker.noCheck = true;
				
				return rtObj;
			}
		}
		, 
		"about_to_exit":
		{
			fnCheck: function(args)
			{
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				
				var cb = 
				{ 
					ev: "mouseleave",
					el: document.body,
					fn: function() 
					{ 
						rtObj.fnCheck = function() { return true; } 
					}
				};
				checker.eventCb.push(cb);
				
				return rtObj;
			}
		},
		"referring_url":
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				var uri = document.referrer;
				var re = new RegExp(confObj.value, "i");
				if(re.test(uri))
				{
					rtObj.fnCheck = function() { return true; };
					return rtObj;
				}
				
				checker.noCheck = true;
				
				return rtObj;
			}
		},
		"url_in_history":
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				var uri = document.baseURI;
				var history = window.localStorage.getItem('pagesVisitedUrls').split(',');

				for(let i=0; i<history.length; i++){
					var re = new RegExp(history[i], "i");
					if(re.test(uri))
					{
						rtObj.fnCheck = function() { return true; };
						return rtObj;
					}
				}			
				
				checker.noCheck = true;
				
				return rtObj;
			}
		},
		"first_visit": 
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				if(checker.visitStat.firstVisit)
				{
					rtObj.fnCheck = function() { return true; };
					return rtObj;
				}
				
				checker.noCheck = true;
				return rtObj;
			}
		}
		,"pages_visited_n": 
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				if(checker.visitStat.pagesVisited >= parseInt(confObj.value))
				{
					rtObj.fnCheck = function() { return true; };
					return rtObj;
				}
				
				checker.noCheck = true;
				return rtObj;
			}
		}
		,"visit_duration":
		{
			fnCheck: function(args)
			{
				var n = Date.now() / 1000;

				if(n >= this.visitStop)
					return true;
					
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				rtObj.visitStop = Date.now() / 1000 + parseInt(confObj.value);
				
				checker.timerCbSec = true;
				
				return rtObj;
			}
		}
		,"chatted_before":
		{
			fnCopyConf: function(confObj, rtObj, checker)
			{
				if(window.localStorage.getItem('chattedBefore') == 'true'){
					window.localStorage.removeItem('chattedBefore');
					rtObj.fnCheck = function() { return true; };
					return rtObj;
				}
				
				checker.noCheck = true;
				return rtObj;
			}
		}
		,"scrolls_to_depth":
		{
			fnCheck: function(args)
			{
				return false;
			},
			
			fnCopyConf: function(confObj, rtObj, checker)
			{
				rtObj.fnCheck = this.fnCheck;
				rtObj.value = parseInt(confObj.value);
				
				var cb = 
				{ 
					ev: "scroll",
					el: window,
					fn: function() 
					{ 
						var box = document.getElementsByTagName("HTML")[0];
						var h = box.offsetHeight;
						var s = window.pageYOffset;
						var w = window.innerHeight;
						if(w >= h)
							return;
						var s100 = h - w;
						var t = (s * 100 + s100 - 1) / s100;
						if(t >= rtObj.value)
							rtObj.fnCheck = function() { return true; } 
					}
				};	
				
				checker.eventCb.push(cb);
				
				return rtObj;
			}
		}
	};


	return function (conf, chatCb) {

		if(typeof(conf) === "undefined" || typeof(chatCb) === "undefined")
			return;
			
		if(conf == null || chatCb == null)
			return;
			
		var conditions = conf.proactiveOfferCondition;
		if(!conditions)
			return;
			
		
		var ruleChecker = 
		{
			callBack: chatCb,
			ruleSets: [],
			timerCbMin: false,
			timerCbSec: false,
			eventCb: [],
			
			clean: function()
			{
				// clear timers
				if(this.timerCbMin)
				{
					window.clearInterval(this.timerCbMin);
					this.timerCbMin = null;
				}
				
				if(this.timerCbSec)
				{
					window.clearInterval(this.timerCbSec);
					this.timerCbSec = null;
				}
				
				// clear event callbacks
				// we have
				// events: 
				// {
				//   id1: { 
				//         el: <element ref>, 
				//         events: {
				//           click: { 
				//              fn: <callback fn>, 
				//              cb: [ fn1, fn2, fn3 ]
				//           },
				//           keydown: { 
				//              fn: <callback fn>, 
				//              cb: [ fn1, fn2, fn3 ]
				//           }
				//         }
				//   },
				//   id2: { 
				//         el: <element ref>, 
				//         events: {
				//           click: { 
				//              fn: <callback fn>, 
				//              cb: [ fn1, fn2, fn3 ]
				//           },
				//           keydown: { 
				//              fn: <callback fn>, 
				//              cb: [ fn1, fn2, fn3 ]
				//           }
				//         }
				//   }
				// }
				//          
				if(this.events)
				{
					for(var elName in this.events)
					{
						var el = this.events[elName];
						
						if(typeof(el) === "object" && el.events)
						{
							for(var ev in el.events)
							{
								var evt = el.events[ev];
								if(evt.fn)
									el.el.removeEventListener(ev, evt.fn);
							}
						}
					}
					
					this.events = null;
				}
				
			},
			
			check: function()
			{
				if(this.ruleSets.length == 0)
					return;
				
				for(var s = 0; s < this.ruleSets.length; ++s)
				{
					var rules = this.ruleSets[s];
					var bSatisfy = true;
					for(var i = 0; i < rules.length; ++i)
					{
						if(!rules[i].fnCheck())
						{
							bSatisfy = false;
							break;
						}
					}
					if(bSatisfy)
					{
						
						this.clean();
						this.callBack();
						break;
					}
				}
			}
		};


		// initialize local store vars
		var storage = window.localStorage;
		var ls = { 
			firstVisit: true,
			pagesVisited: 0,
			lastVisit: Date.now() / 1000
		};

		
		if(typeof(storage) !== "undefined")
		{
			if(typeof(storage.proactiveVisitCount) === "undefined" || !storage.proactiveVisitCount || storage.proactiveVisitCount === "")
			{
				ls.firstVisit = true;
				ls.pagesVisited = 0;
				
				storage.proactiveVisitCount = 1;	
			} 
			else
			{
				ls.firstVisit = false;
				ls.pagesVisited = parseInt(storage.proactiveVisitCount);
				storage.proactiveVisitCount = ls.pagesVisited + 1;
				
			}
			
			if(typeof(storage.pagesVisitedUrls) === "undefined" || !storage.pagesVisitedUrls || storage.pagesVisitedUrls === ""){
				storage.pagesVisitedUrls=window.location.pathname;
			} 
			else
			{
				if(storage.pagesVisitedUrls.indexOf(window.location.pathname) == -1){
					storage.pagesVisitedUrls += ',' + window.location.pathname;
				}
			}
			
			if(typeof(storage.proactiveVisitTime) === "undefined" ||  storage.proactiveVisitTime === "")
			{
				storage.proactiveVisitTime = ls.lastVisit;
				storage.proactiveVisitCount = 1;
				ls.pagesVisited = 0;
			}
			else
			{
				var lv = parseInt(storage.proactiveVisitTime);
				storage.proactiveVisitTime = ls.lastVisit;
				
				if(ls.lastVisit - lv > 60 * 60) // new session
				{
					storage.proactiveVisitCount = 1;
					ls.pagesVisited = 0;
				}
				
				ls.lastVisit = lv;
			}
		}
		
		// iterate through condition sets
		for(var j = 0; j < conditions.length; ++j)
		{
			var condition = conditions[j];
			var rules = condition.rules;
			if(!rules)
				continue;
		
			if(typeof(rules) !== "object")
				continue;
			
			var set = [];

			// local checker for particular condition set
			var checker = {
				timerCbMin: null,
				timerCbSec: null,
				eventCb: [],
				visitStat: ls
			};

			
			// iterate through AND conditions in the set
			for(var i = 0; i < rules.length; ++i)
			{
				var rule = rules[i];
				if(typeof(rule) !== "object")
					continue;
					
				var ruleType = rule.ruleType;
				var ruleCheck = proactiveChatRuleMatcher[ruleType];
				
				if(typeof(ruleCheck) !== "object")
					continue;

				set.push(ruleCheck.fnCopyConf(rule, {}, checker));
				
				if(checker.noCheck)
					break;
			}
			
			// check if the set is not empty and it is not permanently false
			if(!checker.noCheck && set.length > 0)
			{
				// aggregate event callbacks
				if(checker.eventCb.length > 0)
					ruleChecker.eventCb = ruleChecker.eventCb.concat(checker.eventCb);
					
				// check if the set is permanently true
				var bDone = true;
				
				for(var r = 0; r < set.length; ++r)
				{
					if(!set[r].fnCheck())
					{
						bDone = false;
						break;
					}
				}
				
				if(bDone)
				{
					// if true - call callback and return
					chatCb();
					return;
				}
				
				// aggregate timer requests and add the the set to rules
				if(checker.timerCbMin)
					ruleChecker.timerCbMin = true;

				if(checker.timerCbSec)
					ruleChecker.timerCbSec = true;
				
					
				ruleChecker.ruleSets.push(set);
			}
		}

		
		// install event callbacks
		var cbs = 
		{
		};
		
		var pseudoId = "#$%876adr_0_";
		
		for(var i = 0; i < ruleChecker.eventCb.length; ++i)
		{
			var ecb = ruleChecker.eventCb[i];
			var eid;
			
			// if element does not have id - set temporary one
			if(ecb.el === window)
			{
				eid = "thisBrowserWindow";
			}
			else if(!(eid = ecb.el.getAttribute( "id" )))
			{
				eid = pseudoId + i;
				ecb.el.setAttribute("id", eid);
			}
			
			// if we don't have callbacks for the element - initialize it
			if(!cbs[eid])
				cbs[eid] = { el: ecb.el, events: {} };
			
			var evts = cbs[eid].events;
			
			if(!evts[ecb.ev])
			{
				// if we don't have the event callback for the element - initialize it
				var obj = evts[ecb.ev] = { cb:[ ecb.fn ] };
				obj.fn = function() 
				{ 
					for(var e = 0; e < obj.cb.length; ++e)
					{
						obj.cb[e]();
					}
					
					ruleChecker.check();
				};
				
				ecb.el.addEventListener( ecb.ev, obj.fn );
			}
			else
			{
				// if we have callback for the event - add callback function to array
				evts[ecb.ev].cb.push(ecb.fn);
			}
		}
		
		// clear temporarily set ids
		for(var eid in cbs)
		{
			if(eid.startsWith(pseudoId))
			{
				var els = cbs[eid];
				els.el.removeAttribute( "id" );
			}
		}
		
		this.eventCb = [];
		ruleChecker.events = cbs;
		
		// install timers
		if(ruleChecker.timerCbMin)
		{
			if(ruleChecker.timerCbSec)
				ruleChecker.timerCbMin = false;
			else
				ruleChecker.timerCbMin = window.setInterval(function() { ruleChecker.check() }, 60 * 1000);
		}

		if(ruleChecker.timerCbSec)
			ruleChecker.timerCbSec = window.setInterval(function() { ruleChecker.check() }, 1000);
		
	}
});