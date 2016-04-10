
/**
 * Get all users
 */
function all_users_map(Doc,Meta) {
  if (Doc.Type!="USER")
    return;

  //emit
  Doc.Id = Meta.id;
  emit(Doc.Id,Doc);
}
/**/

//end of file