
//all_documents/map
function all_documents(Doc,Meta) {
  Doc.Id = Meta.id;
  emit(Doc.Id,Doc);
}
//function/end

//end of file