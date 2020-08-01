<?php
if (!$this->session->userdata('usertype')) {
    $this->load->helper('url');
    redirect('auth/login');
}
$messCount = $this->db->query("select * from (select message.client_id, (SELECT EXISTS( SELECT * from message_flag where client_id = message.client_id and user_id = 1)) as message_flag from (SELECT * FROM message_table ORDER BY id desc) message GROUP BY client_id) t1 where t1.message_flag=1")->num_rows();
?>
<html lang="en" dir="ltr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="msapplication-TileColor" content="#0061da">
    <meta name="theme-color" content="#1643a3">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="HandheldFriendly" content="True">
    <meta name="MobileOptimized" content="320">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
    <link rel="icon" href="<?php echo $base_url; ?>/assets/images/favicon.png" type="image/x-icon">
    <link rel="shortcut icon" type="image/x-icon" href="<?php echo $base_url; ?>/assets/images/favicon.png">
    <!-- Title -->
    <title>Vida</title>
    <link rel="stylesheet" href="<?php echo $base_url; ?>/assets/fonts/fonts/font-awesome.min.css">
    <!-- Font family -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" rel="stylesheet">
    <!-- Dashboard Css -->
    <link href="<?php echo $base_url; ?>/assets/css/timepicker.min.css" rel="stylesheet">

    <link href="<?php echo $base_url; ?>/assets/css/dashboard.css" rel="stylesheet">
    <link href="<?php echo $base_url; ?>/assets/css/vida.css" rel="stylesheet">
    <!-- c3.js Charts Plugin -->
    <link href="<?php echo $base_url; ?>/assets/plugins/charts-c3/c3-chart.css" rel="stylesheet">
    <!-- Custom scroll bar css-->
    <link href="<?php echo $base_url; ?>/assets/plugins/scroll-bar/jquery.mCustomScrollbar.css" rel="stylesheet">
    <!---Font icons-->
    <link href="<?php echo $base_url; ?>/assets/plugins/iconfonts/plugin.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/1.10.19/css/dataTables.bootstrap4.min.css" rel="stylesheet">
    <link href="<?php echo $base_url; ?>/assets/plugins/sweet-alert/sweetalert.css" rel="stylesheet" />
</head>

<body class="">
    <div id="global-loader" style="display: none;"></div>
    <div class="page">
        <div class="page-main">
            <div class="header py-2">
                <div class="container">
                    <div class="d-flex">
                        <a class="header-brand" href="<?php echo $base_url; ?>"> <img src="<?php echo $base_url; ?>assets/images/brand/logo.png" class="header-brand-img" alt="vobilet logo"> </a>
                        <div class="d-flex order-lg-2 ml-auto">
                        <a class="commicationBox" href="<?php echo $base_url; ?>communication"> <span>COMUNICAÇÕES</span> </a>

                            <!-- <span class="commicationBox">COMUNICAÇÕES</span> -->
                            <div class="dropdown d-none d-md-flex">
                                <a href="<?php echo $base_url; ?>message"><i class="fa fa-envelope-o nav-link icon"  aria-expanded="false"><span class="badge badge-primary" style="border-radius: 50%; height: 20px; width: 20px;"><?=$messCount==0?"":$messCount?></span></i></a>
                            </div>
                            <div class="dropdown">
                                <a href="#" class="nav-link pr-0 leading-none dropdownImagebox" data-toggle="dropdown">
                                    <!-- <span class="avatar avatar-md brround" style="background-image: url(<?php echo $base_url . '/' . $this->session->userdata('image'); ?>)"></span>  -->
                                    <span class="mr-2 d-none d-lg-block"><span class="text-dark"><b><?= $this->session->userdata('username') ?></b></span></span>
                                    <img class="avatar avatar-md brround" src="<?= $base_url . '/' . $this->session->userdata('image') ?>" alt="img">
                                </a>
                                <div class="dropdown-menu dropdown-melnu-right dropdown-menu-arrow" style="min-width: auto;">
                                    <a class="dropdown-item" href="<?php echo $base_url; ?>profile"> <i class="dropdown-icon mdi mdi-account-outline "></i> Editar Perfil </a>
                                    <a class="dropdown-item" href="<?php echo $base_url; ?>auth/logout"> <i class="dropdown-icon mdi  mdi-logout-variant"></i> Sair </a>
                                </div>
                            </div>
                        </div>
                        <a href="#" class="header-toggler d-lg-none ml-3 ml-lg-0 menuToggler" style="margin-top:11px;" data-toggle="collapse" data-target="#headerMenuCollapse"> <span class="header-toggler-icon"></span> </a>
                    </div>
                </div>
            </div>
            <div class="vobilet-navbar fixed-heade" id="headerMenuCollapse">
                <div class="container">
                    <ul class="nav">

                        <li class="nav-item ">
                            <a class="nav-link tab_dashboard" href="<?php echo $base_url; ?>"> <i class="fa fa-home"></i> <span> PAINEL DE CONTROLE</span> </a>
                        </li>
                        <?php if ($this->session->userdata("usertype") == 1) { ?>

                            <li class="nav-item ">
                                <a class="nav-link tab_clinics" href="<?php echo $base_url; ?>clinics"> <i class="fa fa-cubes"></i> <span> CLINICAS</span> </a>
                            </li>
                        <?php } ?>

                        <li class="nav-item">
                            <a class="nav-link tab_client" href="<?php echo $base_url; ?>client"> <i class="fa fa-window-restore"></i> <span>CLIENTES</span> </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link tab_appointment" href="<?php echo $base_url; ?>appointment"> <i class="fa fa-pencil-square-o"></i> <span>Marcações</span> </a>
                            <!-- <?php echo $base_url; ?>appointment" -->
                        </li>
                        <li class="nav-item">
                            <a class="nav-link tab_message" href="<?php echo $base_url; ?>message"> <i class="fa fa-file-text-o"></i> <span>MENSAGENS</span> </a>
                        </li>

                        <li class="nav-item">
                            <!-- <a class="nav-link tab_campaigns" href="<?php echo $base_url; ?>campaigns"> <i class="fa fa-newspaper-o"></i> <span>CAMPHANS</span> </a> -->
                            <a class="nav-link tab_campaigns" href="<?php echo $base_url; ?>campaigns"> <i class="fa fa-newspaper-o"></i> <span>CAMPANHAS</span> </a>
                        </li>
                    </ul>
                </div>
            </div>