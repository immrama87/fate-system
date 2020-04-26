const MessageTemplates = require('../config/messages.json');

const Messages = (function(){
  function getTemplate(templateId){
    let templateKeys = templateId.split(".");
    let template = MessageTemplates;
    let key;
    while((key = templateKeys.shift()) != undefined){
      if(template.hasOwnProperty(key)){
        template = template[key];
      }
      else {
        throw writeMessage('errors.messages.template', templateId);
      }
    }

    if(typeof template != 'string') throw writeMessage('errors.messages.nomessage', templateId);

    return template;
  }

  function writeMessage(){
    let args = Array.from(arguments);
    let templateId = args.shift();
    let template = getTemplate(templateId);

    let re = /%(\d+)(?:\.\.\.(.*):)?/gm;
    let m;
    while((m = re.exec(template)) != null){
      let value = args[m[1]];
      if(m[2]){
        if(Array.isArray(value)){
          value = value.join(m[2]);
        }
        else {
          value = value.split(",").join(m[2]);
        }
      }
      template = template.substring(0, m.index) +
        value +
        template.substring(m.index + m[0].length);
    }

    return template;
  }

  return {
    write: writeMessage
  };
});

module.exports = Messages();
