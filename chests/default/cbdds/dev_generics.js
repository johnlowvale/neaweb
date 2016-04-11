
/**
 * Get all documents with Id as key
 */
function all_documents_by_id_map(Doc,Meta) {
  Doc.Id = Meta.id;
  emit(Doc.Id,Doc);
}
/**/

//end of file