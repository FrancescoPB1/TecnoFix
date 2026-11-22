package pe.tecnofix.backend.modelo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "ordenes")
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String codigo;

    @ManyToOne(optional = false)
    private Cliente cliente;

    @ManyToOne(optional = false)
    private Equipo equipo;

    @ManyToOne(optional = false)
    private Sede sede;

    @ManyToOne
    private Usuario tecnico;

    @Column(nullable = false)
    private boolean enGarantia;

    @Column(nullable = false, length = 500)
    private String falla;

    @Column(length = 200)
    private String accesorios;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EstadoOrden estado;

    @Column(length = 1000)
    private String diagnostico;

    @Column(precision = 10, scale = 2)
    private BigDecimal montoPresupuesto;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Decision decision;

    @Column(length = 500)
    private String actividad;

    @Column(length = 300)
    private String repuestos;

    @Column(length = 500)
    private String pruebas;

    @Column(length = 80)
    private String receptor;

    @Column(length = 200)
    private String accesoriosDevueltos;

    @Column(length = 300)
    private String observacionesEntrega;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL)
    @OrderBy("id ASC")
    private List<MovimientoOrden> historial = new ArrayList<>();

    public Orden() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    @JsonIgnore
    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }

    @JsonIgnore
    public Sede getSede() {
        return sede;
    }

    public void setSede(Sede sede) {
        this.sede = sede;
    }

    @JsonIgnore
    public Usuario getTecnico() {
        return tecnico;
    }

    public void setTecnico(Usuario tecnico) {
        this.tecnico = tecnico;
    }

    public boolean isEnGarantia() {
        return enGarantia;
    }

    public void setEnGarantia(boolean enGarantia) {
        this.enGarantia = enGarantia;
    }

    public String getFalla() {
        return falla;
    }

    public void setFalla(String falla) {
        this.falla = falla;
    }

    public String getAccesorios() {
        return accesorios;
    }

    public void setAccesorios(String accesorios) {
        this.accesorios = accesorios;
    }

    public EstadoOrden getEstado() {
        return estado;
    }

    public void setEstado(EstadoOrden estado) {
        this.estado = estado;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public BigDecimal getMontoPresupuesto() {
        return montoPresupuesto;
    }

    public void setMontoPresupuesto(BigDecimal montoPresupuesto) {
        this.montoPresupuesto = montoPresupuesto;
    }

    public Decision getDecision() {
        return decision;
    }

    public void setDecision(Decision decision) {
        this.decision = decision;
    }

    public String getActividad() {
        return actividad;
    }

    public void setActividad(String actividad) {
        this.actividad = actividad;
    }

    public String getRepuestos() {
        return repuestos;
    }

    public void setRepuestos(String repuestos) {
        this.repuestos = repuestos;
    }

    public String getPruebas() {
        return pruebas;
    }

    public void setPruebas(String pruebas) {
        this.pruebas = pruebas;
    }

    public String getReceptor() {
        return receptor;
    }

    public void setReceptor(String receptor) {
        this.receptor = receptor;
    }

    public String getAccesoriosDevueltos() {
        return accesoriosDevueltos;
    }

    public void setAccesoriosDevueltos(String accesoriosDevueltos) {
        this.accesoriosDevueltos = accesoriosDevueltos;
    }

    public String getObservacionesEntrega() {
        return observacionesEntrega;
    }

    public void setObservacionesEntrega(String observacionesEntrega) {
        this.observacionesEntrega = observacionesEntrega;
    }

    public List<MovimientoOrden> getHistorial() {
        return historial;
    }

    public void setHistorial(List<MovimientoOrden> historial) {
        this.historial = historial;
    }

    public void agregarMovimiento(EstadoOrden estado, String responsable, String detalle) {
        MovimientoOrden movimiento = new MovimientoOrden();
        movimiento.setOrden(this);
        movimiento.setFecha(LocalDateTime.now());
        movimiento.setEstado(estado);
        movimiento.setResponsable(responsable);
        movimiento.setDetalle(detalle);
        historial.add(movimiento);
    }

    public Long getClienteId() {
        return cliente == null ? null : cliente.getId();
    }

    public String getClienteNombre() {
        return cliente == null ? null : cliente.getNombres();
    }

    public Long getEquipoId() {
        return equipo == null ? null : equipo.getId();
    }

    public Long getSedeId() {
        return sede == null ? null : sede.getId();
    }

    public String getSedeNombre() {
        return sede == null ? null : sede.getNombre();
    }

    public Long getTecnicoId() {
        return tecnico == null ? null : tecnico.getId();
    }

    public String getTecnicoNombre() {
        return tecnico == null ? null : tecnico.getNombre();
    }

}