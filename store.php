<?php
//check if request is POST
if (isset($_POST['product'])) {
    postRoute($_POST);
    exit;
}
//check if request is GET
if (isset($_GET['all'])) {
    getRoute();
    exit;
}
// if no valid request
http_response_code('400');
printf('%s', json_encode(array('status' => 'error', 'message' => 'invalid request')));
/**
 * Route for GET Request
 */
function getRoute()
{
    header('Content-type: application/json');
    $result = prepareResult();
    printf('%s', json_encode(array('status' => 'success', 'data' => $result)));
}
/**
 * prepare result to return
 * @param array $decoded
 */
function prepareResult()
{
    $result = get_all_contents();
    $decoded = trim($result) == '' ?
        [] :  json_decode($result);

    return $decoded;
}
/**
 * Route for POST Request
 */
function postRoute($post)
{
    $result = get_all_contents();
    $old = json_decode($result, true);
    is_array($old) ? createUpdate($post, $old) : save(array($post['id'] => $post));
}
/**
 * Create/Update Storage
 * @param array $post - Posted data from form
 * @param array $old - Data from storage
 * @return void
 */
function createUpdate($post, $old)
{
    $old[$post['id']] = $post;
    save($old);
}
/**
 * Get content from storage
 * @return string|false
 */
function get_all_contents()
{
    return file_get_contents("store.json");
}
/**
 * Update storage
 * @param array $data Updated data
 * @return void
 */
function save($data)
{
    $encoded = json_encode($data);
    file_put_contents("store.json", $encoded);
}
