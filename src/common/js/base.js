let base={};
let timer=null;
base.contains=function (refNode,otherNode){
  if (typeof  refNode.contains==="function"){
    return refNode.contains(otherNode);
  }else if (typeof refNode.compareDocumentPosition==="function"){
    return !! (refNode.compareDocumentPosition(otherNode) && 16);
  }else {
    let node =otherNode.parentNode;
    do {
      if (node===refNode){
        return true;
      }else {
        node=node.parentNode;
      }
    }while (node!==null);
    return false;
  }
};
base.getParent=function(node,nodeName){
  let name=node.nodeName.toLowerCase();
  while (name!==nodeName && node!==document.body){
    node=node.parentNode;
    name=node.nodeName.toLowerCase();
  }
  return node===document.body?false:node;
};
base.scrollTopAnimate=function(element,endScrollTop,step){

  endScrollTop=endScrollTop<=0?0:endScrollTop;
  timer=setTimeout(function () {
    let scrollTop=element.scrollTop;
    if (scrollTop===endScrollTop){
      clearTimeout(timer);
      element=endScrollTop=null;
      return false;
    }
    element.scrollTop=scrollTop+step;
    base.scrollTopAnimate(element,endScrollTop,step);
  },16)
};
base.DoubleLinkedList=function(){
  let Node=function (element,indicator,caption) {
    this.element=element;
    this.indicator=indicator;
    this.caption=caption;
    this.next=null;
    this.prev=null;
  };

  let length=0;
  let head=null;
  let tail=null;


  this.insert=function (position,element,indicator,caption) {


    if (position>=0 && position<=length ){
      let node=new Node(element,indicator,caption);
      let current=head;
      let prev,index=0;

      if (position===0){
        if (!head){
          head=node;
          tail=node;
          tail.next=head;
          head.prev=tail;
        }else {
          node.next=current;
          current.prev=node;
          head=node;
          node.prev=tail;
        }
      } else  if (position===length){
        current=tail;
        current.next=node;
        node.prev=current;
        tail=node;
        tail.next=head;
        head.prev=tail;
      }else {

        while (index++ <position){
          prev=current;
          current=current.next;
        }
        node.next=current;
        node.prev=prev;

        prev.next=node;
        current.prev=node;
      }
      length++;
      return true;
    }else {
      return false;
    }
  };

  this.removeAt=function (position) {
    if (position>-1 && position<length){
      let current=head;
      let prev,index=0;

      if (position===0){
        head=current.next;

        current.next.prev=tail;
        head=current.next;
      }else if (position===length-1){
        current=tail;

        current.prev.next=head;
        head.prev=current.prev;
        tail=current.prev;
      }else {
        while (index++ <position){
          prev=current;
          current=current.next;
        }
        prev.next=current.next;
        current.next.prev=prev;
      }
      length--;
      return true;
    }else {
      return false;
    }
  };

  this.indexOf=function (element,key) {
    let current=head,index=0;

    while (current){
      if (element===current[key]){
        return index;
      }
      index++;
      current=current.next;
    }
  };

  this.getNode=function (element,key) {
    let current=head;

    while (current){
      if (element===current[key]){
        return current;
      }
      current=current.next;
    }
  };


  this.remove=function (element) {
    let index=this.indexOf(element);
    return this.removeAt(index);
  };

  this.getHead=function () {
    return head;
  };

  this.getSize=function () {
    return length;
  }
  return this;
};
base.getParentByClass=function(node,className){
  let limit=document.documentElement;
  let isContained=node.classList.contains(className);
  while (!isContained && node!==limit){
    node=node.parentNode;
    isContained=node.classList.contains(className);

  }
  return node===document.body?false:node;
};
base.scrollLeftAnimate=function(element,endScrollLeft,step){
  clearTimeout(timer);
  timer=setTimeout(function () {
    let scrollLeft=element.offsetLeft;
    if (Math.abs(scrollLeft-endScrollLeft)<Math.abs(step)){
      clearTimeout(timer);
      element=endScrollLeft=null;
      return false;
    }
    element.style.left=scrollLeft+step+"px";
    base.scrollLeftAnimate(element,endScrollLeft,step);
  },16)
};
export default base;
