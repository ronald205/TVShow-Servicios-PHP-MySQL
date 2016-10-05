<?php
require_once "DB.php";   
class RequestAPI {    
    public function API(){
        header('Content-Type: application/JSON');                
        $method = $_SERVER['REQUEST_METHOD'];
        switch ($method) {
        case 'GET'://consulta
            $this->getTVShow();
            break;     
        case 'POST'://inserta
            $this->saveTVShow();
            break;                
        case 'PUT'://actualiza
             $this->updateTVShow();
            break;      
        case 'DELETE'://elimina
            $this->deleteTVShow();
            break;
        default://metodo NO soportado
            $this->response(405);
            break;
        }
    }  
    
    /**
     * Respuesta al cliente
     * @param int $code Codigo de respuesta HTTP
     * @param String $status indica el estado de la respuesta puede ser "success" o "error"
     * @param String $message Descripcion de lo ocurrido
     */
     function response($code=200, $status="", $message="") {
        http_response_code($code);
        if( !empty($status) && !empty($message) ){
            $response = array("status" => $status ,"message"=>$message);  
            echo json_encode($response,JSON_PRETTY_PRINT);    
        }            
     }  

/**
  * función que segun el valor de "action" e "id":
  *  - mostrara una array con todos los registros de personas
  *  - mostrara un solo registro 
  *  - mostrara un array vacio
  */
     
    function getTVShow() {
          if($_GET['action']=='tvshows'){         
              $db = new TVShowDB();
             if(isset($_GET['id'])){//muestra 1 solo registro si es que existiera ID                 
                 $response = $db->getTVShow($_GET['id']);                
                 echo json_encode($response,JSON_PRETTY_PRINT);
             }else{ //muestra todos los registros                   
                 $response = $db->getTVShows();              
                 echo json_encode($response,JSON_PRETTY_PRINT);
             }
         }else{
                $this->response(400);
         }       
    }   
    
 /**
 * metodo para guardar un nuevo TVShow en la base de datos
 */
    function saveTVShow(){
        if($_GET['action']=='tvshows'){   
            //Decodifica un string de JSON
            $obj = json_decode( file_get_contents('php://input') );   
            $objArr = (array)$obj;
           if (empty($objArr)){
               $this->response(422,"error","Nothing to add. Check json");                               
           }else if(isset($obj)){
               $people = new TVShowDB();     
               $people->insert($obj);
               $this->response(200,"success","new record added");                             
           }else{
               $this->response(422,"error","The model is not defined");
           }
       } else{               
           $this->response(400);
       }  
    }    
    
/**
 * Actualiza un recurso
 */
    function updateTVShow() {
        if( isset($_GET['action']) && isset($_GET['id']) ){
            if($_GET['action']=='tvshows'){
                $obj = json_decode( file_get_contents('php://input') );                   
                $objArr = (array)$obj;
                if (empty($objArr)){                        
                    $this->response(422,"error","Nothing to add. Check json");                        
                }else if(isset($obj)){
                    $db = new TVShowDB();
                    $db->update($_GET['id'], $obj);
                    $this->response(200,"success","Record updated");                             
                }else{
                    $this->response(422,"error","The model is not defined");                        
                }     
                exit;
           }
        }
        $this->response(400);
    }   
 /**
     * elimina TVShow
     */
    function deleteTVShow(){
        if( isset($_GET['action']) && isset($_GET['id']) ){
            if($_GET['action']=='tvshows'){                   
                $db = new TVShowDB();
                $db->delete($_GET['id']);
                $this->response(204);                   
                exit;
            }
        }
        $this->response(400);
    }    
}//end class

