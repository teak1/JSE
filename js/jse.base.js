(function(module){
  const DOM=document;
  const WIN=window;
var nil = new class nil{
  constructor(){}
}
function checkDependencies(data){
  if(module){
    let modules = module.modules;
    for(var i = 0;i<data.length;i++){
      if(!modules[data[i]])
      {
        console.log(modules)
        throw new Error("module "+data[i]+" not found");
      }
    }
  }else{
    throw new Error("module not found, this may be an error if you are using node.js");
  }
};
module.export=new module.package("JSE",class JSE{
  constructor(threadPath){
    window.JSEGLOBAL={threadPath:threadPath};
    this.fs = new (require("jse.fs"))();
    this.engine_data = this.fs.loadJSON("files/engine_data.json").then((data)=>{
      this.engine_data=data;
      checkDependencies(data.$min);
    });
    this.fast_mode = typeof(Worker)!=='undefined';
    this.surface= nil;
    this.renderer = nil;
    this.events={};
    this.math=new (require("JSE.subpackage.math"))();
    this.draw_loop=()=>{
      WIN.requestAnimationFrame(this.draw_loop);
      this.__framedata__.frameCount++;
      this.events.draw=this.events.draw||[];
      this.events.draw.forEach(a=>a(this.__framedata__));
    }
    this.on('load',this.draw_loop);
    this.__framedata__={
      frameCount:0
    };
    this.fs = new (require("jse.fs"))();
  }
  on(event,func){
    switch(event){
        case "load":
          WIN.addEventListener("load",func);
        break;
        default:
          this.events[event]=this.events[event]||[];
          this.events[event].push(func);
        break;
    }

  }
  createSurface(w,h,elem){
    var can = DOM.createElement("canvas");
    can.setAttribute("width",w+"px");
    can.setAttribute("height",h+"px");
    var render = require("JSE.subpackage.render");
    if(elem&&elem.appendChild){
      elem.appendChild(can);
    }else{
      DOM.body.appendChild(can);
    }
    this.surface=can;
    this.renderer=new render(this.surface);
    return this.renderer;
  }
});
})(module);
