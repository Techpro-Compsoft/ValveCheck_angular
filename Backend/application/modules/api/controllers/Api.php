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
        if (!isset($_POST['username']) || $_POST['username'] == "") {
            $json = array('status' => 'error', 'txt' => 'Username cannot be empty');

        }
        //  elseif (!(preg_match("/^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,5}$/", $_POST['email']))) {
        //     $json = array('status' => 'error', 'txt' => 'Invalid email');

        // }
        elseif (!isset($_POST['password']) || $_POST['password'] == "") {
            $json = array('status' => 'error', 'txt' => 'password cannot be empty');

        }
        //  elseif (!isset($_POST['player_id']) || $_POST['player_id'] == "") {
        //     $json = array('status' => 'error', 'txt' => 'Player Id cannot be empty');

        // }
        else {
            $json = $this->model->login($_POST);
        }
        print_r(json_encode($json));
    }

    // ADD PLAYER ID //
    public function addPlayerId()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['player_id']) || $_POST['player_id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Player Id cannot be empty');
            } else {
                $json = $this->model->addPlayerId($_POST, $user_id);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // ADD PLAYER ID //
    public function deletePlayerId()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            $json = $this->model->deletePlayerId($user_id);
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET PROFILE DETAILS //
    public function getProfile()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            $json = array(
                'status' => 'success',
                'data' => $this->db->get_where('user', array('id'=>$user_id))->result()[0],
            );
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
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
                'data' => $this->db->order_by('company_name')->get('company')->result(),
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
            $companyData = array('company' => $company, 'farms' => $this->db->order_by('farm_name')->get_where('farm', array('company' => $_POST['id']))->result(), 'supervisor' => $supervisorData, 'operator' => $operatorData);
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
            } else if (!isset($_POST['ltr_hr']) || $_POST['ltr_hr'] == "") {
                $json = array('status' => 'error', 'txt' => 'Ltr/Hour cannot be empty');
            }
            //  else if (!isset($_POST['latitude']) || $_POST['latitude'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'Latitude cannot be empty');
            // } else if (!isset($_POST['longitude']) || $_POST['longitude'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'Longitude cannot be empty');
            // }
             else {
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
            } else if (!isset($_POST['ltr_hr']) || $_POST['ltr_hr'] == "") {
                $json = array('status' => 'error', 'txt' => 'Ltr/Hour cannot be empty');
            }
            //  else if (!isset($_POST['latitude']) || $_POST['latitude'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'Latitude cannot be empty');
            // } else if (!isset($_POST['longitude']) || $_POST['longitude'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'Longitude cannot be empty');
            // }
             else {
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
                $this->db->order_by('block_name');
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
            } else if (!isset($_POST['username']) || $_POST['username'] == "") {
                $json = array('status' => 'error', 'txt' => 'Username cannot be empty');
            } else if (!isset($_POST['password']) || $_POST['password'] == "") {
                $json = array('status' => 'error', 'txt' => 'Password cannot be empty');
            } else if (!isset($_POST['phone']) || $_POST['phone'] == "") {
                $json = array('status' => 'error', 'txt' => 'Phone cannot be empty');
            } else if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $email_exist = "";
                $username_exist = $this->db->get_where('user', array('username' => $_POST['username']))->num_rows();
                if (isset($_POST['email']) && $_POST['email'] != "") {
                    $email_exist = $this->db->get_where('user', array('email' => $_POST['email']))->num_rows();
                }
                $phone_exist = $this->db->get_where('user', array('phone' => $_POST['phone']))->num_rows();
                if ($username_exist) {
                    $json = array('status' => 'error', 'txt' => 'Username already exist');
                } else if ($email_exist) {
                    $json = array('status' => 'error', 'txt' => 'Email already exist');
                } else if ($phone_exist) {
                    $json = array('status' => 'error', 'txt' => 'Phone already exist');
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
    public function getFarmForUsers()
    {
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
    public function getBlockForUsers()
    {
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
    public function assignHours()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['block']) || $_POST['block'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block Id cannot be empty');
            } else if (!isset($_POST['time']) || $_POST['time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Time cannot be empty');
            }
            //  else if (!isset($_POST['start_time']) || $_POST['start_time'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'Start time cannot be empty');
            // } else if (!isset($_POST['end_time']) || $_POST['end_time'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'End time cannot be empty');
            // }
             else if (!isset($_POST['operator']) || $_POST['operator'] == "") {
                $json = array('status' => 'error', 'txt' => 'Operator Id cannot be empty');
            } else {
                $json = $this->model->assignHours($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET BLOCK TIME DATA //
    public function getCycle()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['block']) || $_POST['block'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block Id cannot be empty');
            } else {
                $json = $this->model->getCycle($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // UPDATE HOURS TO BLOCK //
    public function updateHours()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Cycle Id cannot be empty');
            } else if (!isset($_POST['time']) || $_POST['time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Time cannot be empty');
            }
            //  else if (!isset($_POST['start_time']) || $_POST['start_time'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'Start time cannot be empty');
            // } else if (!isset($_POST['end_time']) || $_POST['end_time'] == "") {
            //     $json = array('status' => 'error', 'txt' => 'End time cannot be empty');
            // }
             else {
                $json = $this->model->updateHours($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // OPEN VALVE //
    public function openBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Cycle Id cannot be empty');
            } else if (!isset($_POST['start_time']) || $_POST['start_time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Start time cannot be empty');
            } else {
                $json = $this->model->openBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // INTERRUPTION IN VALVE //
    public function interruptBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Cycle Id cannot be empty');
            } else if (!isset($_POST['interruption_reason']) || $_POST['interruption_reason'] == "") {
                $json = array('status' => 'error', 'txt' => 'Interruption reason cannot be empty');
            } else if (!isset($_POST['time']) || $_POST['time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Time cannot be empty');
            } else {
                $json = $this->model->interruptBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // RESUME VALVE //
    public function resumeBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Cycle Id cannot be empty');
            } else if (!isset($_POST['start_time']) || $_POST['start_time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Start time cannot be empty');
            } else {
                $json = $this->model->resumeBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // CLOSE BLOCK //
    public function closeBlock()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Cycle Id cannot be empty');
            } else if (!isset($_POST['stop_time']) || $_POST['stop_time'] == "") {
                $json = array('status' => 'error', 'txt' => 'Stop time cannot be empty');
            } else {
                $json = $this->model->closeBlock($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET REPORT DATA //
    public function getReport()
    {
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['company']) || $_POST['company'] == "") {
                $json = array('status' => 'error', 'txt' => 'Company Id cannot be empty');
            } else if (!isset($_POST['date']) || $_POST['date'] == "") {
                $json = array('status' => 'error', 'txt' => 'Date cannot be empty');
            } else {
                $json = $this->model->getReport($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // SEND ALERT TO STOP BLOCK //
    public function sendAlert()
    {
        $cycleData = $this->db->get_where('cycle', array('created_at' => date('Y-m-d'), 'actual_start_time!=' => null))->result();
        foreach ($cycleData as $key => $value) {
            if ($value->interruption_reason) {
                $datetime1 = new DateTime($value->actual_start_time);
                $datetime2 = new DateTime($value->actual_stop_time);
                $interval = $datetime1->diff($datetime2);
                $minUsed = $interval->format('%h') * 60 + $interval->format('%i');

                $instruction = explode(":", $value->instruction);
                $minLeft = ($instruction[0] * 60 + $instruction[1]) - $minUsed;
                $hoursLeft = intdiv($minLeft, 60) . ':' . ($minLeft % 60);

                $time = explode(":", $hoursLeft);
                $endTime = date('H:i', strtotime(isset($time[1]) ? '+' . $time[0] . ' hour +' . $time[1] . ' minutes' : '+' . $time[0] . ' hour', strtotime($value->interruption_resume)));

                if (!$value->interruption_stop && $value->interruption_resume && strtotime(date('H:i')) > strtotime($endTime)) {
                    // Notification send code
                    $this->sendNotification($value->id);
                }
            } else {
                $time = explode(":", $value->instruction);
                $endTime = date('H:i', strtotime(isset($time[1]) ? '+' . $time[0] . ' hour +' . $time[1] . ' minutes' : '+' . $time[0] . ' hour', strtotime($value->actual_start_time)));
                if (!$value->actual_stop_time && strtotime(date('H:i')) > strtotime($endTime)) {
                    // Notification send code
                    $this->sendNotification($value->id);
                }
            }
        }
    }

    public function sendNotification($id)
    {
        $this->db->select("(SELECT player_id from user where user.id=1) adminId, (SELECT player_id from user where user.id=cycle.operator) operatorId, farm.supervisor supId, farm.id as farm_id, farm.company as company_id, block.id as block_id, cycle.operator as operator_id, block.latitude as lat, block.longitude as `long`", false);
        $this->db->from('cycle');
        $this->db->join('block', 'block.id=cycle.block', 'left');
        $this->db->join('farm', 'block.farm=farm.id', 'left');
        $this->db->where('cycle.id', $id);
        $playerData = $this->db->get()->result()[0];
        $supId = explode(",", $playerData->supId);
        $playerId = array($playerData->adminId, $playerData->operatorId);
        foreach ($supId as $key => $value) {
            $playerId[] = $this->db->get_where('user', array('id' => $value))->result()[0]->player_id;
        }

        $fields = array(
            'app_id' => "d1613e76-96f6-4b7c-a9a7-cf76811a62df",
            // 'app_id' => "a2377344-621c-4ead-8928-2b70705417c2",
            'include_player_ids' => $playerId,
            'data' => array("company_id" => $playerData->company_id, "farm_id" => $playerData->farm_id, "block_id" => $playerData->block_id, "operator_id" => $playerData->operator_id, "lat"=>$playerData->lat, "long"=>$playerData->long),
            'contents' => array("en" => "You forgot to close the valve. Please close it asap."),
        );
        // print_r($fields); die;
        $fields = json_encode($fields);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        curl_close($ch);
    }

    // UPDATE CO-ORDINATES FOR BLOCK //
    public function updateCoordinates(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['block']) || $_POST['block'] == "") {
                $json = array('status' => 'error', 'txt' => 'Block Id cannot be empty');
            }  else if (!isset($_POST['latitude']) || $_POST['latitude'] == "") {
                $json = array('status' => 'error', 'txt' => 'Latitude cannot be empty');
            } else if (!isset($_POST['longitude']) || $_POST['longitude'] == "") {
                $json = array('status' => 'error', 'txt' => 'Longitude cannot be empty');
            } else {
                $json = $this->model->updateCoordinates($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // ADD INTERRUPTION REASON //
    public function addReason(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['reason']) || $_POST['reason'] == "") {
                $json = array('status' => 'error', 'txt' => 'Reason cannot be empty');
            } else {
                $json = $this->model->addReason($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // DELETE INTERRUPTION REASON //
    public function delReason(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['id']) || $_POST['id'] == "") {
                $json = array('status' => 'error', 'txt' => 'Id cannot be empty');
            } else {
                $json = $this->model->delReason($_POST);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET INTERRUPTION REASON LIST //
    public function getReason(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            $json = array(
                'status' => 'success',
                'data' => $this->db->order_by('reason')->get('interruption_reaon')->result(),
            );
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }

    // GET BLOCKS TABLE LIST //
    public function getBlocksTable(){
        $token_header = @$this->input->request_headers()['token'];
        $user_id = @$this->input->request_headers()['user_id'];

        if (check_token($token_header, $user_id)) {
            if (!isset($_POST['role']) || $_POST['role'] == "") {
                $json = array('status' => 'error', 'txt' => 'Role cannot be empty');
            } else {
                $json = $this->model->getBlocksTable($user_id, $_POST['role']);
            }
        } else {
            $json = array('status' => 'error', 'txt' => 'Invalid Token');
            http_response_code(401);
        }

        print_r(json_encode($json));
    }
}
