<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Api extends MX_Controller
{

    public function __construct()
    {
        header('Access-Control-Allow-Origin: *');
        header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, token, user_id");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        $method = $_SERVER['REQUEST_METHOD'];
        if ($method == "OPTIONS") {
            die();
        }
        $_POST = json_decode(file_get_contents('php://input'), true);
        parent::__construct();
        $this->load->helper("url");
        $this->load->helper('custom_helper');

        $this->load->model(get_class($this) . '_model', 'model');
    }

    // LOGIN //
    public function login()
    {
        if (!isset($_POST['email']) || $_POST['email'] == "") {
            $json = array('status' => 'error', 'txt' => 'email address cannot be empty');

        } elseif (!(preg_match("/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/", $_POST['email']))) {
            $json = array('status' => 'error', 'txt' => 'Invalid email');

        } elseif (!isset($_POST['password']) || $_POST['password'] == "") {
            $json = array('status' => 'error', 'txt' => 'password cannot be empty');

        } else {
            $json = $this->model->login($_POST);
        }
        print_r(json_encode($json));
    }

    // CREATE COMPANY //
    public function createCompany()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['company_name']) || $_POST['company_name'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company name cannot be empty');
            } else {
                $json = $this->model->createCompany($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // UPDATE COMPANY //
    public function updateCompany()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Id cannot be empty');
            } else if (!isset($_POST['company_name']) || $_POST['company_name'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company name cannot be empty');
            } else {
                $json = $this->model->updateCompany($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET COMPANY LIST //
    public function getCompanies()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            $json = array(
                'status' => 'success',
                'data' => $this->db->get('company')->result(),
            );
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET COMPANY DETAILS //
    public function getCompanyDetails()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            // $this->db->select('company.*, (select fullname from user where user.id = company.supervisor) supervisor_name');
            $company = $this->db->get_where('company', array('id' => $_POST['id']))->result()[0];
            $supervisor = explode(',', $company->supervisor);
            $operator = explode(',', $company->operator);
            $supervisorData = array();
            $operatorData = array();
            if ($company->supervisor) {
                foreach ($supervisor as $key => $value) {
                    $supervisorData[] = $this->db->get_where('user', array('id' => $value))->result()[0];
                }
            }
            if ($company->operator) {
                foreach ($operator as $key => $value) {
                    $operatorData[] = $this->db->get_where('user', array('id' => $value))->result()[0];
                }
            }
            $companyData = array('company' => $company, 'farms' => $this->db->get_where('farm', array('company' => $_POST['id']))->result(), 'supervisor' => $supervisorData, 'operator' => $operatorData);
            $json = array(
                'status' => 'success',
                'data' => $companyData,
            );
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // CREATE FARM //
    public function createFarm()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['company']) || $_POST['company'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company cannot be empty');
            } else if (!isset($_POST['farm_name']) || $_POST['farm_name'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm name cannot be empty');
            } else {
                $json = $this->model->createFarm($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // UPDATE FARM //
    public function updateFarm()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Id cannot be empty');
            } else if (!isset($_POST['company']) || $_POST['company'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company cannot be empty');
            } else if (!isset($_POST['farm_name']) || $_POST['farm_name'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm name cannot be empty');
            } else {
                $json = $this->model->updateFarm($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET FARM DETAILS //
    public function getFarmDetails()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            $farm = $this->db->get_where('farm', array('id' => $_POST['id']))->result()[0];
            $supervisor = explode(',', $farm->supervisor);
            $operator = explode(',', $farm->operator);
            $supervisorData = array();
            $operatorData = array();
            if ($farm->supervisor) {
                foreach ($supervisor as $key => $value) {
                    $supervisorData[] = $this->db->get_where('user', array('id' => $value))->result()[0];
                }
            }
            if ($farm->operator) {
                foreach ($operator as $key => $value) {
                    $operatorData[] = $this->db->get_where('user', array('id' => $value))->result()[0];
                }
            }
            $farmData = array('farm' => $farm, 'supervisor' => $supervisorData, 'operator' => $operatorData);
            $json = array(
                'status' => 'success',
                'data' => $farmData,
            );
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // CREATE BLOCK //
    public function createBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['farm']) || $_POST['farm'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm cannot be empty');
            } else if (!isset($_POST['block_name']) || $_POST['block_name'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block name cannot be empty');
            } else if (!isset($_POST['hectares']) || $_POST['hectares'] == "") {
                $json = array('status' => 'error', 'txt' => 'Hectares cannot be empty');
            } else if (!isset($_POST['latitude']) || $_POST['latitude'] == "") {
                $json = array('status' => 'error', 'txt' => 'Latitude cannot be empty');
            } else if (!isset($_POST['longitude']) || $_POST['longitude'] == "") {
                $json = array('status' => 'error', 'txt' => 'Longitude cannot be empty');
            } else {
                $json = $this->model->createBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // UPDATEE BLOCK //
    public function updateBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Id cannot be empty');
            } else if (!isset($_POST['farm']) || $_POST['farm'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm cannot be empty');
            } else if (!isset($_POST['block_name']) || $_POST['block_name'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block name cannot be empty');
            } else if (!isset($_POST['hectares']) || $_POST['hectares'] == "") {
                $json = array('status' => 'error', 'txt' => 'Hectares cannot be empty');
            } else if (!isset($_POST['latitude']) || $_POST['latitude'] == "") {
                $json = array('status' => 'error', 'txt' => 'Latitude cannot be empty');
            } else if (!isset($_POST['longitude']) || $_POST['longitude'] == "") {
                $json = array('status' => 'error', 'txt' => 'Longitude cannot be empty');
            } else {
                $json = $this->model->updateBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET BLOCK LIST //
    public function getBlockList()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Id cannot be empty');
            } else {
                $this->db->select('block.*, (select fullname from user where user.id = block.operator) operator_name');
                $blockData = $this->db->get_where('block', array('farm' => $_POST['id']))->result();
                $json = array(
                    'status' => 'success',
                    'data' => $blockData,
                );
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // CREATE USER //
    public function createUser()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['fullname']) || $_POST['fullname'] == "") {
                $json = array('status' => 'error', 'txt' => 'Name cannot be empty');
            } else if (!isset($_POST['email']) || $_POST['email'] == "") {
                $json = array('status' => 'error', 'txt' => 'Email cannot be empty');
            } else if (!isset($_POST['password']) || $_POST['password'] == "") {
                $json = array('status' => 'error', 'txt' => 'Password cannot be empty');
            } else if (!isset($_POST['phone']) || $_POST['phone'] == "") {
                $json = array('status' => 'error', 'txt' => 'Phone cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $email_exist = $this->db->get_where('user', array('email' => $_POST['email']))->num_rows();
                if ($email_exist) {
                    $json = array('status' => 'error', 'txt' => 'Email already exist');
                } else {
                    $_POST['password'] = base64_encode($_POST['password']);
                    $json = $this->model->createUser($_POST);
                }
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // UPDATE USER //
    public function updateUser()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Id cannot be empty');
            } else if (!isset($_POST['fullname']) || $_POST['fullname'] == "") {
                $json = array('status' => 'error', 'txt' => 'Name cannot be empty');
            } else if (!isset($_POST['phone']) || $_POST['phone'] == "") {
                $json = array('status' => 'error', 'txt' => 'Phone cannot be empty');
            } else {
                if (isset($_POST['password']) && $_POST['password'] != "") {
                    $_POST['password'] = base64_encode($_POST['password']);
                }
                $json = $this->model->updateUser($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET USER DETAILS //
    public function getUserDetails()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->getUserDetails($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET EMPTY COMPANIES //
    public function getEmptyCompanies()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->getEmptyCompanies($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET EMPTY USERS FOR COMPANY //
    public function getEmptyUsersCompany()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->getEmptyUsersCompany($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // ASSIGN COMPANY //
    public function assignCompany()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['company']) || $_POST['company'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company cannot be empty');
            } else if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->assignCompany($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // UPDATE COMPANY ASSIGN //
    // public function updateAssignCompany(){
    //     $token_header = @$this->input->request_headers()['token'];
    //     $user_id = @$this->input->request_headers()['user_id'];

    //     if (check_token($token_header, $user_id)) {
    //         if (!isset($_POST['company']) || $_POST['company'] == "") {
    //             $json = array('status' => 'error', 'txt' => 'Company cannot be empty');
    //         } else if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
    //             $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
    //         } else {
    //             $json = $this->model->updateAssignCompany($_POST);
    //         }
    //     } else {
    //         $json = array('status' => 'error', 'txt' => 'Invalid Token');
    //         http_response_code(401);
    //     }

    //     print_r(json_encode($json));
    // }

    // DELETE ASSIGNED COMPANY //
    public function deleteAssignCompany()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['company']) || $_POST['company'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company cannot be empty');
            } else if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->deleteAssignCompany($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // ASSIGN FARM //
    public function assignFarm()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['farm']) || $_POST['farm'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm cannot be empty');
            } else if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->assignFarm($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // DELETE ASSIGNED FARM //
    public function deleteAssignFarm()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['farm']) || $_POST['farm'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm cannot be empty');
            } else if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->deleteAssignFarm($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // ASSIGN BLOCK //
    public function assignBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['block']) || $_POST['block'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block cannot be empty');
            } else if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
            } else {
                $json = $this->model->assignBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // DELETE ASSIGNED BLOCK //
    public function deleteAssignBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['block']) || $_POST['block'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block cannot be empty');
            } else {
                $json = $this->model->deleteAssignBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET FARM LIST FOR USERS //
    public function getFarmForUsers(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['user_id']) || $_POST['user_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'User Id cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->getFarmForUsers($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET BLOCK LIST FOR USERS //
    public function getBlockForUsers(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['farm']) || $_POST['farm'] == "") {
                $json = array('status' => 'error', 'txt' => 'Farm Id cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->getBlockForUsers($_POST, $user_id);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // ASSIGN HOURS TO BLOCK //
    public function assignHours(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['block']) || $_POST['block'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block Id cannot be empty');
            } else if (!isset($_POST['time']) || $_POST['time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Time cannot be empty');
            } else {
                $json = $this->model->assignHours($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }
}
