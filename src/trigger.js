import { expBackoff, sleep } from './utils';

const TRIGGER = 'trigger_WebsiteMonitor';
const INTERVAL = 1;

const toggleTrigger = enableTrigger => {
  const triggerList = {};

  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (enableTrigger) {
      triggerList[trigger.getHandlerFunction()] = true;
    } else {
      expBackoff(() => ScriptApp.deleteTrigger(trigger));
      sleep();
    }
  });

  if (enableTrigger) {
    if (!triggerList[TRIGGER]) {
      ScriptApp.newTrigger(TRIGGER)
        .timeBased()
        .everyMinutes(INTERVAL)
        .create();
      sleep();
    }
  }
};

export const deleteTrigger = () => {
  expBackoff(() => toggleTrigger(false));
};

export const createTrigger = () => {
  expBackoff(() => toggleTrigger(true));
};
