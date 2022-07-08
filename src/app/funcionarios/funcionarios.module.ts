import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionariosRoutingModule } from './funcionarios-routing.module';
import { ListarFuncionariosComponent } from './pages/listar-funcionarios/listar-funcionarios.component';
import { MaterialModule } from '../material/material.module';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFuncionarioComponent } from './components/form-funcionario/form-funcionario.component';
import { HttpClientModule } from '@angular/common/http';
import { DeletarFuncComponent } from './components/deletar-func/deletar-func.component';
import { GPodeSairComponent } from './components/g-pode-sair/g-pode-sair.component';



@NgModule({
  declarations: [
    ListarFuncionariosComponent,
    FuncionarioComponent,    
    FormFuncionarioComponent, DeletarFuncComponent, GPodeSairComponent
  ],
  imports: [
    CommonModule,
    FuncionariosRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule
    
  ]
})
export class FuncionariosModule { }
