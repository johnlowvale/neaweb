
/**
 * Get all documents
 */
function all_documents_map(Doc,Meta) {
  Doc.Id = Meta.id;
  emit(Doc.Id,Doc);
}
/**/

//end of file