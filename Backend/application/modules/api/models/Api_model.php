<?php

class Api_model extends CI_Model
{
    public function __construct()
    {

    }

    public function login($loginData)
    {
        $this->db->where('email', $loginData['email']);
        $this->db->where('password', base64_encode($loginData['password']));

        $data = $this->db->get('user');
        if (!$data->result()) {
            $json = array(
                'status' => 'error',
                'txt' => 'Invalid Email or Password',
            );
            //http_response_code(400);
        } else {
            $data = $data->result();
            unset($data[0]->token);
            unset($data[0]->password);
            $token = substr(md5(uniqid(mt_rand(), true)), 0, 15);
            $this->db->where('id', $data[0]->id);
            $this->db->update('user', array('token' => $token));
            $companyData = "";
            if ($data[0]->role == 2) {
                $this->db->select('id, company_name');
                $this->db->where("FIND_IN_SET('" . $data[0]->id . "',supervisor) !=", 0);
                $companyData = $this->db->get('company')->result();
                if ($companyData) {
                    $companyData = $companyData[0];
                } else {
                    $companyData = "";
                }
            } else if ($data[0]->role == 3) {
                $this->db->select('id, company_name');
                $this->db->where("FIND_IN_SET('" . $data[0]->id . "',operator) !=", 0);
                $companyData = $this->db->get('company')->result();
                if ($companyData) {
                    $companyData = $companyData[0];
                } else {
                    $companyData = "";
                }
            }
            $userData = array('token' => $token, 'user' => $data[0], 'company' => $companyData);
            $json = array(
                'status' => 'success',
                'data' => $userData,
            );
        }
        return $json;
    }

    public function createCompany($data)
    {
        $this->db->insert('company', $data);
        $json = array(
            'status' => 'success',
            'data' => 'Company Created Successfully',
        );
        return $json;
    }

    public function updateCompany($data)
    {
        $this->db->where('id', $data['id']);
        $this->db->update('company', array('company_name' => $data['company_name']));
        $json = array(
            'status' => 'success',
            'data' => 'Company Updated Successfully',
        );
        return $json;
    }

    public function createFarm($data)
    {
        $this->db->insert('farm', $data);
        $json = array(
            'status' => 'success',
            'data' => 'Farm Created Successfully',
        );
        return $json;
    }

    public function updateFarm($data)
    {
        $this->db->where('id', $data['id']);
        $this->db->update('farm', array('company' => $data['company'], 'farm_name' => $data['farm_name']));
        $json = array(
            'status' => 'success',
            'data' => 'Farm Updated Successfully',
        );
        return $json;
    }

    public function createBlock($data)
    {
        $this->db->insert('block', $data);
        $json = array(
            'status' => 'success',
            'data' => 'Block Created Successfully',
        );
        return $json;
    }

    public function updateBlock($data)
    {
        $id = $data['id'];
        unset($data['id']);
        $this->db->where('id', $id);
        $this->db->update('block', $data);
        $json = array(
            'status' => 'success',
            'data' => 'Block Updated Successfully',
        );
        return $json;
    }

    public function createUser($data)
    {
        $this->db->insert('user', $data);
        $json = array(
            'status' => 'success',
            'data' => 'User Created Successfully',
        );
        return $json;
    }

    public function updateUser($data)
    {
        $id = $data['id'];
        unset($data['id']);
        $this->db->where('id', $id);
        $this->db->update('user', $data);
        $json = array(
            'status' => 'success',
            'data' => 'User Updated Successfully',
        );
        return $json;
    }

    public function getUserDetails($data)
    {
        if ($data['role'] == 2) {
            $this->db->select('user.*, (select id as company_id from company where FIND_IN_SET(user.id, supervisor)) company_id, (select company_name as company_name from company where supervisor = user.id) company_name', false);
        } else {
            $this->db->select('user.*, (select id as company_id from company where FIND_IN_SET(user.id, operator)) company_id, (select company_name as company_name from company where FIND_IN_SET(user.id, operator)) company_name', false);
        }
        $this->db->from('user');
        $this->db->where('role', $data['role']);
        $userData = $this->db->get()->result();
        $json = array(
            'status' => 'success',
            'data' => $userData,
        );
        return $json;
    }

    public function getEmptyCompanies($data)
    {
        if ($_POST['role'] == 2) {
            $this->db->where('supervisor', null);
        } else {
            $this->db->where('operator', null);
        }
        $companyData = $this->db->get('company')->result();
        $json = array(
            'status' => 'success',
            'data' => $companyData,
        );
        return $json;
    }

    public function getEmptyUsersCompany($data)
    {
        if ($_POST['role'] == 2) {
            $companyData = $this->db->query('SELECT * FROM `user` u WHERE Not Exists (Select * From company c where FIND_IN_SET(u.id, c.supervisor)) AND u.role = 2')->result();
        } else {
            $companyData = $this->db->query('SELECT * FROM `user` u WHERE Not Exists (Select * From company c where FIND_IN_SET(u.id, c.operator)) AND u.role = 3')->result();
        }
        $json = array(
            'status' => 'success',
            'data' => $companyData,
        );
        return $json;
    }

    public function assignCompany($data)
    {
        $opData = $this->db->get_where('company', array('id' => $data['company']))->result()[0];
        $data['user_id'] = implode(', ', $data['user_id']);
        if ($data['role'] == 2) {
            $this->db->where('id', $data['company']);
            if ($opData->supervisor) {
                $this->db->set('supervisor', "CONCAT(supervisor,',','" . $data['user_id'] . "')", false);
            } else {
                $this->db->set('supervisor', $data['user_id']);
            }
            $this->db->update('company');
        } else {
            $this->db->where('id', $data['company']);
            if ($opData->operator) {
                $this->db->set('operator', "CONCAT(operator,',','" . $data['user_id'] . "')", false);
            } else {
                $this->db->set('operator', $data['user_id']);
            }
            $this->db->update('company');
        }
        $json = array(
            'status' => 'success',
            'data' => 'Company Assigned Successfully',
        );
        return $json;
    }

    // public function updateAssignCompany($data)
    // {
    //     $this->db->where('supervisor', $data['user_id']);
    //     $this->db->update('company', array('supervisor'=>null));

    //     $this->db->where('id', $data['company']);
    //     $this->db->update('company', array('supervisor'=>$data['user_id']));
    //     $json = array(
    //         'status' => 'success',
    //         'data' => 'Assigned Company Updated Successfully',
    //     );
    //     return $json;
    // }

    public function deleteAssignCompany($data)
    {
        $opData = $this->db->get_where('company', array('id' => $data['company']))->result()[0];
        if ($data['role'] == 2) {
            $usData = explode(",", $opData->supervisor);
            if (($key = array_search($data['user_id'], $usData)) !== false) {
                unset($usData[$key]);
            }
            $usData = implode(",", $usData);
            $this->db->where('id', $data['company']);
            $this->db->update('company', array('supervisor' => $usData));
        } else {
            $usData = explode(",", $opData->operator);
            if (($key = array_search($data['user_id'], $usData)) !== false) {
                unset($usData[$key]);
            }
            $usData = implode(",", $usData);
            $this->db->where('id', $data['company']);
            $this->db->update('company', array('operator' => $usData));
        }
        $json = array(
            'status' => 'success',
            'data' => 'Deleted Successfully',
        );
        return $json;
    }

    public function assignFarm($data)
    {
        $opData = $this->db->get_where('farm', array('id' => $data['farm']))->result()[0];
        $data['user_id'] = implode(', ', $data['user_id']);
        if ($data['role'] == 2) {
            $this->db->where('id', $data['farm']);
            if ($opData->supervisor) {
                $this->db->set('supervisor', "CONCAT(supervisor,',','" . $data['user_id'] . "')", false);
            } else {
                $this->db->set('supervisor', $data['user_id']);
            }
            $this->db->update('farm');
        } else {
            $this->db->where('id', $data['farm']);
            if ($opData->operator) {
                $this->db->set('operator', "CONCAT(operator,',','" . $data['user_id'] . "')", false);
            } else {
                $this->db->set('operator', $data['user_id']);
            }
            $this->db->update('farm');
        }
        $json = array(
            'status' => 'success',
            'data' => 'Farm Assigned Successfully',
        );
        return $json;
    }

    public function deleteAssignFarm($data)
    {
        $opData = $this->db->get_where('farm', array('id' => $data['farm']))->result()[0];
        if ($data['role'] == 2) {
            $usData = explode(",", $opData->supervisor);
            if (($key = array_search($data['user_id'], $usData)) !== false) {
                unset($usData[$key]);
            }
            $usData = implode(",", $usData);
            $this->db->where('id', $data['farm']);
            $this->db->update('farm', array('supervisor' => $usData));
        } else {
            $usData = explode(",", $opData->operator);
            if (($key = array_search($data['user_id'], $usData)) !== false) {
                unset($usData[$key]);
            }
            $usData = implode(",", $usData);
            $this->db->where('id', $data['farm']);
            $this->db->update('farm', array('operator' => $usData));
        }
        $json = array(
            'status' => 'success',
            'data' => 'Deleted Successfully',
        );
        return $json;
    }

    public function assignBlock($data)
    {
        $this->db->update('block', array('operator' => $data['user_id']), array('id' => $data['block']));
        $json = array(
            'status' => 'success',
            'data' => 'Block Assigned Successfully',
        );
        return $json;
    }

    public function deleteAssignBlock($data)
    {
        $this->db->update('block', array('operator' => null), array('id' => $data['block']));
        $json = array(
            'status' => 'success',
            'data' => 'Deleted Successfully',
        );
        return $json;
    }

    public function getFarmForUsers($data){
        if ($data['role'] == 2) {
            $this->db->where("FIND_IN_SET('" . $data['user_id'] . "',supervisor) !=", 0);
        } else {
            $this->db->where("FIND_IN_SET('" . $data['user_id'] . "',operator) !=", 0);
        }
        $farmData = $this->db->get('farm')->result();
        $json = array(
            'status' => 'success',
            'data' => $farmData,
        );
        return $json;
    }

    public function getBlockForUsers($data, $user_id){
        if ($data['role'] == 2) {
            $this->db->select('block.*, (select fullname from user where user.id = block.operator) operator', false);
            $blockData = $this->db->get_where("block", array("farm"=>$data['farm']))->result();
        } else {
            $blockData = $this->db->get_where("block", array("farm"=>$data['farm'], 'operator'=>$user_id))->result();
        }
        $json = array(
            'status' => 'success',
            'data' => $blockData,
        );
        return $json;
    }

    public function assignHours($data){
        $this->db->insert('cycle', array('block'=>$data['block'],'instruction'=>$data['time'],'created_at'=>date('Y-m-d')));
        $json = array(
            'status' => 'success',
            'data' => 'Hours Assigned Successfully',
        );
        return $json;
    }
}
