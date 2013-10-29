(function( M ){

  var resource_modelID = 'SCHOOL,COMPANY,LOCATION,FRIEND_LIST,GROUP_FR_LIST,CONTACT_LIST,PHOTO,DOODLE,SINA_BIND,SMS,GIF,USER_PROFILE,CHECK_CLIENT'.split(',');
  var resource_ClientName = 'SchoolSelector,CorpSelector,Location,FriendsSelector,GroupSelector,ContactSelector,PhotoSelector,Doodle,SinaBind,SMS,GifMaker,UserProfile,ClientCheck'.split(',');
  var control_modelID = 'OPEN_NAMECARD'.split(',');
  var control_ClientName = 'Profile'.split(',');
  var i;

  // resource
  i = resource_modelID.length;
  while(i--){
    M.Client[resource_ClientName[i]] = M.extend( M.Client.Model, {
       modelID: resource_modelID[i],
       modelType: 'resource'
    });
  }

  // control
  i = control_modelID.length;
  while(i--){
    M.Client[control_ClientName[i]] = M.extend( M.Client.Model, {
       modelID: control_modelID[i],
       modelType: 'control'
    });
  }

  // others
  M.Client.Close = function(){
    M.locate("miliao://control/close_webview?id=1")
  };





/*
 M.Client.SchoolSelector = M.extend( M.Client.Model ,{
    modelID:'SCHOOL',
    modelType:'resource'
 });
 M.Client.CorpSelector = M.extend( M.Client.Model ,{
    modelID:'COMPANY',
    modelType:'resource'
 });

 M.Client.Location = M.extend( M.Client.Model ,{
    modelID:'LOCATION',
    modelType:'resource'
 });
 M.Client.FriendsSelector = M.extend( M.Client.Model ,{
    modelID:'FRIEND_LIST',
    modelType:'resource'
 });
 M.Client.GroupSelector = M.extend( M.Client.Model ,{
    modelID:'GROUP_FR_LIST',
    modelType:'resource'
 });
 M.Client.ContactSelector = M.extend( M.Client.Model ,{
    modelID:'CONTACT_LIST',
    modelType:'resource'
 });
 M.Client.PhotoSelector = M.extend( M.Client.Model ,{
    modelID:'PHOTO',
    modelType:'resource'
 });
 M.Client.Doodle = M.extend( M.Client.Model ,{
    modelID:'DOODLE',
    modelType:'resource'
 });
 M.Client.SinaBind = M.extend( M.Client.Model ,{
    modelID:'sina_bind',
    modelType:'resource'
 });
 M.Client.SMS = M.extend( M.Client.Model ,{
    modelID:'SMS',
    modelType:'resource'
 });
 M.Client.GifMaker = M.extend( M.Client.Model ,{
    modelID:'GIF',
    modelType:'resource'
 });
 */

/*
 M.Client.AudioPlayer = M.extend( M.Client.Model ,{
    modelID:'AUDIO_PLAYER',
    modelType:'resource'
 });
 M.Client.Smiley = M.extend( M.Client.Model ,{
    modelID:'SMILEY',
    modelType:'resource'
 });
*/

/*
 M.Client.Profile = M.extend( M.Client.Model , {
    modelID:'OPEN_NAMECARD',
    modelType:'control'
 });
*/
}( M ));
