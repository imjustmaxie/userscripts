// ==UserScript==
// @name        Typeset.io (Scispace) Premium Unlock
// @namespace   Violentmonkey Scripts
// @match       https://typeset.io/*
// @grant       none
// @version     1.0
// @require     https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @downloadURL https://github.com/imjustmaxie/userscripts/raw/refs/heads/main/typeset.js
// @author      ijm
// @run-at      document-start
// @description Unlocks Scispace's Typeset.io premium features without login (except PDF to video).
// ==/UserScript==
/* global ajaxHooker*/

// Scispace uses the domain typeset.io until the end of 2024.

(function(){
    'use strict';
  
      ajaxHooker.hook(request => {
          if ( request.url.includes('hooks/literature-review') || request.url.includes('hooks/citation-generator')
              || request.url.includes('hooks/paraphraser') || request.url.includes('hooks/ask-question')
              || request.url.includes('hooks/concept-search') || request.url.includes('hooks/copilot-messages')
              || request.url.endsWith('hooks/extract-data') || request.url.includes('hooks/podcasts')
              || request.url.endsWith('hooks/column-data-export') || request.url.endsWith('hooks/ai-detector') )
  
              {
              request.response = res => {
                //console.log(res.responseText);
                const resp = JSON.parse(res.responseText);
                resp.has_access = true;
                if (typeof resp.allowed_count != 'undefined' && (resp.allowed_count != null && resp.allowed_count <=0 )) {
                  resp.allowed_count = 1;
                }
                if (typeof resp.total_consumed_count != 'undefined') {
                  resp.total_consumed_count = 0;
                }
                resp.consumed_count = 0;
                res.responseText = JSON.stringify(resp);
                //console.log(res.responseText);
              };
          }
  
        if (request.url.includes('hooks/models')) {
              request.response = res => {
                const resp = JSON.parse(res.responseText);
                const a = "data" in resp ? resp.data : resp;
                a.forEach((element) =>{
                  element.has_access = true;
                });
                res.responseText = JSON.stringify("data" in resp ? (resp.data=a,resp) : a );
              };
          }
  
        if (request.url.endsWith('global-insights/configs')) {
              request.response = res => {
                const resp = JSON.parse(res.responseText);
                const a = "configs" in resp ? resp.configs : resp;
                a.paper_count.forEach((element)=>{
                  if (element.is_locked == true) {element.is_locked = false;}
                })
                res.responseText = JSON.stringify("configs" in resp ? (resp.configs=a,resp) : a );
              };
        }
  
        if (request.url.endsWith('/concepts/insights/configs')) {
              request.response = res => {
                  const resp = JSON.parse(res.responseText);
                  const a = "configs" in resp ? resp.configs : resp;
                  const b = a.concept_count;
                  b.forEach((element) => {element.is_locked = false;});
                  res.responseText = JSON.stringify("configs" in resp ? (resp.configs=a,resp) : a );
              };
          }
  
      });
  })();