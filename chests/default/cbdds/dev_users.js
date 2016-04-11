
/**
 * Get all users with Id as key
 */
function all_users_by_id_map(Doc,Meta) {
  if (Doc.Type!="USER")
    return;

  //emit
  Doc.Id = Meta.id;
  emit(Doc.Id,Doc);
}
/**/

/**
 * Get all users with Username as key
 */
function all_users_by_username_map(Doc,Meta) {
  if (Doc.Type!="USER")
    return;

  //emit
  Doc.Id = Meta.id;
  emit(Doc.Username,Doc);
}
/**/

//end of file