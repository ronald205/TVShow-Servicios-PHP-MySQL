<?php
/** 
 * @web http://www.jc-mouse.net/
 * @author jc mouse
 */
class TVShowDB {
    
    protected $mysqli;
    const LOCALHOST = '127.0.0.1';
    const USER = 'root';
    const PASSWORD = '';
    const DATABASE = 'tvshows';
    
    /**
     * Constructor de clase
     */
    public function __construct() {           
        try{
            //conexión a base de datos
            $this->mysqli = new mysqli(self::LOCALHOST, self::USER, self::PASSWORD, self::DATABASE);
        }catch (mysqli_sql_exception $e){
            //Si no se puede realizar la conexión
            http_response_code(500);
            exit;
        }     
    } 
    
    /**
     * obtiene un solo registro dado su ID
     * @param int $id identificador unico de registro
     * @return Array array con los registros obtenidos de la base de datos
     */
    public function getTVShow($id){      
        $stmt = $this->mysqli->prepare("SELECT * FROM tvshow WHERE id=? ;");
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();        
        $tvshow = $result->fetch_all(MYSQLI_ASSOC); 
        $stmt->close();
        return $tvshow;              
    }
    
    /**
     * obtiene todos los registros de la tabla "people"
     * @return Array array con los registros obtenidos de la base de datos
     */
    public function getTVShows(){        
        $result = $this->mysqli->query('SELECT * FROM tvshow');          
        $tvshows = $result->fetch_all(MYSQLI_ASSOC);          
        $result->close();
        return $tvshows; 
    }
    
    /**
     * añade un nuevo registro en la tabla tvshow
     * @param String tvshow
     * @return bool TRUE|FALSE 
     */
    public function insert($obj){
        $stmt = $this->mysqli->prepare("INSERT INTO tvshow(title, year, country, poster, seasons, genre, summary) VALUES (?,?,?,?,?,?,?); ");
        $stmt->bind_param('sississ', $obj->title, $obj->year, $obj->country, $obj->poster, $obj->seasons, $obj->genre, $obj->summary);
        $r = $stmt->execute(); 
        $stmt->close();
        return $r;        
    }
    
    /**
     * elimina un registro dado el ID
     * @param int $id Identificador unico de registro
     * @return Bool TRUE|FALSE
     */
    public function delete($id) {
        $stmt = $this->mysqli->prepare("DELETE FROM tvshow WHERE id = ? ; ");
        $stmt->bind_param('i', $id);
        $r = $stmt->execute(); 
        $stmt->close();
        return $r;
    }
    
    /**
     * Actualiza registro dado su ID
     * @param int $id Description
     */
    public function update($id, $obj) {
        //return $obj;
        if($this->checkID($id)){
            $stmt = $this->mysqli->prepare("UPDATE tvshow SET title=?, year=?, country=?, poster=?, seasons=?, genre=?, summary=? WHERE id = ? ; ");
            $stmt->bind_param('sississi', $obj->title, $obj->year, $obj->country, $obj->poster, $obj->seasons, $obj->genre, $obj->summary, $id);
            $r = $stmt->execute(); 
            $stmt->close();
            return $r;    
        }
        return false;
    }
    
    /**
     * verifica si un ID existe
     * @param int $id Identificador unico de registro
     * @return Bool TRUE|FALSE
     */
    public function checkID($id){
        $stmt = $this->mysqli->prepare("SELECT * FROM tvshow WHERE ID=?");
        $stmt->bind_param('i', $id);
        if($stmt->execute()){
            $stmt->store_result();    
            if ($stmt->num_rows == 1){                
                return true;
            }
        }        
        return false;
    }
    
}
?>
