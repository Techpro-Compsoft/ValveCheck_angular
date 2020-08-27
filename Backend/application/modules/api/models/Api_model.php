<?php

class Api_model extends CI_Model
{
    public function __construct()
    {

    }

    public function login($loginData)
    {
        $this->db->where('username', $loginData['username']);
        $this->db->where('password', base64_encode($loginData['password']));

        $data = $this->db->get('user');
        if (!$data->result()) {
            $json = array(
                'status' => 'error',
                'txt' => 'Invalid Username or Password',
            );
            //http_response_code(400);
        } else {
            $data = $data->result();
            unset($data[0]->token);
            unset($data[0]->password);
            $token = substr(md5(uniqid(mt_rand(), true)), 0, 15);
            $this->db->where('id', $data[0]->id);
            $this->db->update('user', array('token' => $token));
            // $this->db->update('user', array('token' => $token, 'player_id'=>$loginData['player_id']));
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

    public function addPlayerId($data, $user_id)
    {
        $this->db->where('id', $user_id);
        $this->db->update('user', array('player_id' => $data['player_id']));
        $json = array(
            'status' => 'success',
            'data' => 'Player Id Added Successfully',
        );
        return $json;
    }

    public function deletePlayerId($user_id)
    {
        $this->db->where('id', $user_id);
        $this->db->update('user', array('player_id' => null));
        $json = array(
            'status' => 'success',
            'data' => 'Player Id Deleted Successfully',
        );
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
            $this->db->select('user.*, (select id as company_id from company where FIND_IN_SET(user.id, supervisor)) company_id, (select company_name as company_name from company where FIND_IN_SET(user.id, supervisor)) company_name', false);
        } else {
            $this->db->select('user.*, (select id as company_id from company where FIND_IN_SET(user.id, operator)) company_id, (select company_name as company_name from company where FIND_IN_SET(user.id, operator)) company_name', false);
        }
        $this->db->from('user');
        $this->db->where('role', $data['role']);
        $this->db->order_by('fullname');
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
        $this->db->order_by('company_name');
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
            $companyData = $this->db->query('SELECT * FROM `user` u WHERE Not Exists (Select * From company c where FIND_IN_SET(u.id, c.supervisor)) AND u.role = 2 order by fullname')->result();
        } else {
            $companyData = $this->db->query('SELECT * FROM `user` u WHERE Not Exists (Select * From company c where FIND_IN_SET(u.id, c.operator)) AND u.role = 3 order by fullname')->result();
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
        $data['user_id'] = implode(',', $data['user_id']);
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
        $data['user_id'] = implode(',', $data['user_id']);
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
        $this->db->order_by('farm_name');
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
            $this->db->order_by('block_name');
            $blockData = $this->db->get_where("block", array("farm"=>$data['farm']))->result();
        } else {
            $blockData = $this->db->order_by('block_name')->get_where("block", array("farm"=>$data['farm'], 'operator'=>$user_id))->result();
        }
        $json = array(
            'status' => 'success',
            'data' => $blockData,
        );
        return $json;
    }

    public function assignHours($data){
        // $this->db->insert('cycle', array('block'=>$data['block'],'instruction'=>$data['time'],'created_at'=>date('Y-m-d'),'instruction_start_time'=>$data['start_time'],'instruction_end_time'=>$data['end_time'],'operator'=>$data['operator']));
        $this->db->insert('cycle', array('block'=>$data['block'],'instruction'=>$data['time'],'created_at'=>date('Y-m-d'),'operator'=>$data['operator']));
        $json = array(
            'status' => 'success',
            'data' => 'Hours Assigned Successfully',
        );
        return $json;
    }

    public function updateHours($data){
        // $this->db->update('cycle', array('instruction'=>$data['time'],'instruction_start_time'=>$data['start_time'],'instruction_end_time'=>$data['end_time']), array('id'=>$data['id']));
        $this->db->update('cycle', array('instruction'=>$data['time']), array('id'=>$data['id']));
        $json = array(
            'status' => 'success',
            'data' => 'Hours Assigned Successfully',
        );
        return $json;
    }

    public function getCycle($data){
        $cycleData = $this->db->get_where('cycle', array('block'=>$data['block'], 'created_at'=>date('Y-m-d')))->result();
        $cycleData = $cycleData?$cycleData:"";
        $json = array(
            'status' => 'success',
            'data' => $cycleData,
        );
        return $json;
    }

    public function openBlock($data){
        $this->db->update('cycle', array('actual_start_time'=>$data['start_time']), array('id'=>$data['id']));
        $json = array(
            'status' => 'success',
            'data' => 'Block Opened Successfully',
        );
        return $json;
    }

    public function interruptBlock($data){
        $this->db->update('cycle', array('actual_stop_time'=>$data['time'],'interruption_reason'=>$data['interruption_reason']), array('id'=>$data['id']));
        $json = array(
            'status' => 'success',
            'data' => 'Block Interrupted Successfully',
        );
        return $json;
    }

    public function resumeBlock($data){
        $this->db->update('cycle', array('interruption_resume'=>$data['start_time']), array('id'=>$data['id']));
        $json = array(
            'status' => 'success',
            'data' => 'Block Resumed Successfully',
        );
        return $json;
    }

    public function closeBlock($data){
        $cycleData = $this->db->get_where('cycle', array('id'=>$data['id']))->result()[0];
        if($cycleData->interruption_reason){
            $this->db->update('cycle', array('interruption_stop'=>$data['stop_time']), array('id'=>$data['id']));
        }
        else{
            $this->db->update('cycle', array('actual_stop_time'=>$data['stop_time']), array('id'=>$data['id']));
        }
        $json = array(
            'status' => 'success',
            'data' => 'Block Closed Successfully',
        );
        return $json;
    }

    public function getReport($data){
        // $this->db->select("farm.farm_name as Farm, block.block_name as Block, (select fullname from user where user.id = cycle.operator) Operator, cycle.instruction as Hours, cycle.instruction_start_time as Start, cycle.instruction_end_time as Stop, cycle.actual_start_time as 'Actual Start', cycle.actual_stop_time as 'Actual Stop', cycle.interruption_reason as Interruption, cycle.interruption_resume as Resume, cycle.interruption_stop as 'Interruption Stop'", false);
        $this->db->select("farm.farm_name as Farm, block.block_name as Block, (select fullname from user where user.id = cycle.operator) Operator, cycle.instruction as Hours, cycle.actual_start_time as Start, cycle.actual_stop_time as Stop, cycle.interruption_reason as Interruption, cycle.interruption_resume as Resume, cycle.interruption_stop as 'Interruption Stop'", false);
        $this->db->from('cycle');
        $this->db->join('block', 'block.id=cycle.block', 'left');
        $this->db->join('farm', 'block.farm=farm.id and farm.company='.$data['company'], 'right');
        $this->db->where('cycle.created_at', $data['date']);
        $repData = $this->db->get()->result();
        $json = array(
            'status' => 'success',
            'data' => $repData,
        );
        return $json;
    }

    public function updateCoordinates($data){
        $id = $data['block'];
        unset($data['block']);
        $this->db->where('id', $id);
        $this->db->update('block', $data);
        $json = array(
            'status' => 'success',
            'data' => 'Coordinates Updated Successfully',
        );
        return $json;
    }

    public function addReason($data){
        $this->db->insert('interruption_reaon', $data);
        $json = array(
            'status' => 'success',
            'data' => 'Reason added Successfully',
        );
        return $json;
    }

    public function delReason($data){
        $this->db->where('id', $data['id']);
        $this->db->delete('interruption_reaon');
        $json = array(
            'status' => 'success',
            'data' => 'Reason deleted Successfully',
        );
        return $json;
    }

    public function getBlocksTable($user_id, $role){
        if($role == 1){
            $this->db->select("block.id, block.block_name, block.latitude, block.longitude, cycle.actual_start_time, cycle.actual_stop_time, cycle.interruption_reason", false);
            $this->db->from('block');
            $this->db->join('cycle', '(cycle.block = block.id and cycle.created_at = CURRENT_DATE)', 'left', false);
            $this->db->order_by('block_name');
            $blockData = $this->db->get()->result();
        }
        else if($role == 2){
            $this->db->select("block.id, block.block_name, block.latitude, block.longitude, cycle.actual_start_time, cycle.actual_stop_time, cycle.interruption_reason", false);
            $this->db->from('farm');
            $this->db->join('block', 'block.farm = farm.id', 'left');
            $this->db->join('cycle', '(cycle.block = block.id and cycle.created_at = CURRENT_DATE)', 'left', false);
            $this->db->where("FIND_IN_SET('" . $user_id . "',farm.supervisor) !=", 0);
            $this->db->order_by('block_name');
            $blockData = $this->db->get()->result();
        }
        else{
            $this->db->select("block.id, block.block_name, block.latitude, block.longitude, cycle.actual_start_time, cycle.actual_stop_time, cycle.interruption_reason", false);
            $this->db->from('farm');
            $this->db->join('block', 'block.farm = farm.id', 'left');
            $this->db->join('cycle', '(cycle.block = block.id and cycle.created_at = CURRENT_DATE)', 'left', false);
            $this->db->where("FIND_IN_SET('" . $user_id . "',farm.operator) !=", 0);
            $this->db->order_by('block_name');
            $blockData = $this->db->get()->result();
        }
        $json = array(
            'status' => 'success',
            'data' => $blockData,
        );
        return $json;
    }
}
